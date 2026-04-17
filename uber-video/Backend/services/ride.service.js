const rideModel = require('../models/ride.model');
const journeyVerificationModel = require('../models/journeyVerification.model');
const mapService = require('./maps.service');
const crypto = require('crypto');

const toId = (value) => String(value);

/* --------------------------------------------------
   OTP GENERATOR – used for meeting point verification
-------------------------------------------------- */
function generateOtp(length = 6) {
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
}

/* --------------------------------------------------
   OPTIONAL: DISTANCE / TIME CALCULATION
   (Safety score, route overlap etc. future use)
-------------------------------------------------- */
async function getDistanceInfo(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }
    return await mapService.getDistanceTime(pickup, destination);
}

module.exports.getDistanceInfo = getDistanceInfo;

async function getRideWithParticipants(rideId) {
    return rideModel.findById(rideId)
        .populate('user')
        .populate('matchedWith');
}

async function getOrCreateJourneyVerification(rideId) {
    let verification = await journeyVerificationModel.findOne({ ride: rideId });

    if (!verification) {
        verification = await journeyVerificationModel.create({
            ride: rideId,
            users: []
        });
    }

    return verification;
}


/* --------------------------------------------------
   CREATE JOURNEY REQUEST
   - Only verified female users allowed
   - Generates meeting OTP
-------------------------------------------------- */
module.exports.createRide = async ({
    user,
    pickup,
    destination,
    departureTime,
    mode,
    schedule
}) => {

    if (!user || !pickup || !destination || !departureTime || !mode) {
        throw new Error('All fields are required');
    }

    // safety rule – women only
    if (user.gender !== 'female' || !user.isVerified) {
        throw new Error('Only verified female users allowed');
    }

    const ride = await rideModel.create({
        user: user._id,
        pickup,
        destination,
        departureTime,
        scheduleLabel: schedule,
        mode,
        status: 'scheduled',
        meetOtp: generateOtp(6),
        meetOtpExpiry: Date.now() + 20 * 60 * 1000, // 20 min
        requestWindowEndsAt: Date.now() + 30 * 60 * 1000
    });

    return ride;
};


/* --------------------------------------------------
   VERIFY MEETING OTP
   - Used at physical meeting point
-------------------------------------------------- */
module.exports.verifyMeetingOtp = async ({ rideId, otp }) => {

    if (!rideId || !otp) {
        throw new Error('Ride id and OTP required');
    }

    const ride = await rideModel.findById(rideId).populate('user');

    if (!ride) throw new Error('Journey not found');

    if (Date.now() > ride.meetOtpExpiry)
        throw new Error('OTP expired');

    if (ride.meetOtp !== otp)
        throw new Error('Invalid OTP');

    ride.meetVerified = true;
    ride.meetOtp = null;
    ride.meetOtpExpiry = null;
    ride.status = 'verified';

    await ride.save();

    const verification = await getOrCreateJourneyVerification(rideId);
    verification.meetOtpVerified = true;
    verification.verifiedForStart = verification.users.some((entry) => entry.faceVerified);
    await verification.save();

    return true;
};

module.exports.verifyCompanionFaceMatch = async ({
    rideId,
    verifierUserId,
    selfieImageUrl,
    referenceImageUrl,
    similarityScore,
    faceVerified
}) => {
    if (!rideId || !verifierUserId || !selfieImageUrl || !referenceImageUrl) {
        throw new Error('Ride, verifier and face verification images are required');
    }

    const ride = await getRideWithParticipants(rideId);

    if (!ride) {
        throw new Error('Journey not found');
    }

    if (!ride.matchedWith) {
        throw new Error('Face verification is available only after a companion match');
    }

    const verifierRole = getParticipantRole(ride, verifierUserId);
    const verifiedUser = verifierRole === 'user' ? ride.matchedWith : ride.user;

    const verification = await getOrCreateJourneyVerification(rideId);
    const existingIndex = verification.users.findIndex((entry) => toId(entry.user) === toId(verifiedUser._id));

    const payload = {
        user: verifiedUser._id,
        verifiedBy: verifierUserId,
        selfieImageUrl,
        referenceImageUrl,
        similarityScore,
        faceVerified: Boolean(faceVerified),
        verifiedAt: faceVerified ? new Date() : undefined
    };

    if (existingIndex >= 0) {
        verification.users[existingIndex] = {
            ...verification.users[existingIndex].toObject(),
            ...payload
        };
    } else {
        verification.users.push(payload);
    }

    verification.verifiedForStart = verification.meetOtpVerified && verification.users.some((entry) => entry.faceVerified);
    await verification.save();

    return {
        rideId: ride._id,
        verifiedUser: verifiedUser._id,
        similarityScore,
        faceVerified: Boolean(faceVerified),
        verifiedForStart: verification.verifiedForStart
    };
};


/* --------------------------------------------------
   START JOURNEY
   - Both companions must be verified
-------------------------------------------------- */
module.exports.startJourney = async ({ rideId }) => {

    const ride = await getRideWithParticipants(rideId);

    if (!ride) throw new Error('Journey not found');

    if (!ride.meetVerified)
        throw new Error('Meeting verification pending');

    const verification = await journeyVerificationModel.findOne({ ride: rideId });

    if (!verification?.verifiedForStart)
        throw new Error('Companion face verification must be completed before starting the journey');

    if (!['matched', 'verified'].includes(ride.status))
        throw new Error('Journey not ready');

    ride.status = 'in_progress';
    ride.startedAt = new Date();
    ride.liveTracking = true;

    await ride.save();

    return ride;
};


/* --------------------------------------------------
   END JOURNEY
   - Dual confirmation can be added later
-------------------------------------------------- */
module.exports.endJourney = async ({ rideId }) => {

    const ride = await rideModel.findById(rideId);

    if (!ride) throw new Error('Journey not found');

    if (ride.status !== 'in_progress')
        throw new Error('Journey not active');

    ride.status = 'completed';
    ride.completedAt = new Date();
    ride.liveTracking = false;

    await ride.save();

    return ride;
};

function getParticipantRole(ride, userId) {
    if (toId(ride.user) === toId(userId)) {
        return 'user';
    }

    if (ride.matchedWith && toId(ride.matchedWith) === toId(userId)) {
        return 'companion';
    }

    throw new Error('You are not part of this journey');
}

module.exports.getRideLiveTracking = async ({ rideId, userId }) => {
    const ride = await rideModel.findById(rideId)
        .populate('user', 'fullname fullName profileImageUrl')
        .populate('matchedWith', 'fullname fullName profileImageUrl');

    if (!ride) {
        throw new Error('Journey not found');
    }

    const role = getParticipantRole(ride, userId);

    return {
        rideId: ride._id,
        role,
        status: ride.status,
        liveTracking: ride.liveTracking,
        liveLocations: ride.liveLocations || {},
        participants: {
            user: ride.user,
            companion: ride.matchedWith
        }
    };
};

module.exports.updateRideLiveLocation = async ({ rideId, userId, location }) => {
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
        throw new Error('Valid latitude and longitude are required');
    }

    const ride = await rideModel.findById(rideId)
        .populate('user', 'fullname fullName profileImageUrl socketId')
        .populate('matchedWith', 'fullname fullName profileImageUrl socketId');

    if (!ride) {
        throw new Error('Journey not found');
    }

    if (!['matched', 'verified', 'in_progress'].includes(ride.status)) {
        throw new Error('Live location is available only for matched or active journeys');
    }

    const role = getParticipantRole(ride, userId);

    ride.liveLocations = {
        ...(ride.liveLocations || {}),
        [role]: {
            lat: location.lat,
            lng: location.lng,
            updatedAt: new Date()
        }
    };

    if (!ride.liveTracking) {
        ride.liveTracking = true;
    }

    await ride.save();

    return {
        rideId: ride._id,
        role,
        status: ride.status,
        liveTracking: ride.liveTracking,
        liveLocations: ride.liveLocations,
        participants: {
            user: ride.user,
            companion: ride.matchedWith
        }
    };
};

/* --------------------------------------------------
   GET FARE CALCULATION
   Calculate fare based on distance
-------------------------------------------------- */
module.exports.getFare = async (pickup, destination) => {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    try {
        // Get coordinates for both addresses
        const pickupCoords = await mapService.getAddressCoordinate(pickup);
        const destinationCoords = await mapService.getAddressCoordinate(destination);
        
        // Get distance and duration
        const distance = await mapService.getDistanceTime(pickupCoords, destinationCoords);
        
        // Simple fare calculation based on distance
        const distanceInKm = distance.distance.value / 1000;
        const baseFare = 50; // Base fare in rupees
        const perKmRate = 10; // Rate per km
        const totalFare = Math.round(baseFare + (distanceInKm * perKmRate));

        return {
            pickup,
            destination,
            distance: distance.distance.text,
            duration: distance.duration.text,
            baseFare,
            perKmRate,
            totalDistance: distanceInKm.toFixed(2),
            fare: {
                economy: totalFare,
                premium: Math.round(totalFare * 1.3),
                shared: Math.round(totalFare * 0.7)
            }
        };
    } catch (error) {
        console.error('Error calculating fare:', error);
        throw error;
    }
};
