const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');

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
    mode
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
        mode,
        status: 'pending',
        meetOtp: generateOtp(6),
        meetOtpExpiry: Date.now() + 20 * 60 * 1000 // 20 min
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

    await ride.save();

    return true;
};


/* --------------------------------------------------
   START JOURNEY
   - Both companions must be verified
-------------------------------------------------- */
module.exports.startJourney = async ({ rideId }) => {

    const ride = await rideModel.findById(rideId)
        .populate('user')
        .populate('matchedWith');

    if (!ride) throw new Error('Journey not found');

    if (!ride.meetVerified)
        throw new Error('Meeting verification pending');

    if (ride.status !== 'matched')
        throw new Error('Journey not ready');

    ride.status = 'ongoing';
    ride.startedAt = new Date();

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

    if (ride.status !== 'ongoing')
        throw new Error('Journey not active');

    ride.status = 'completed';
    ride.completedAt = new Date();

    await ride.save();

    return ride;
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
