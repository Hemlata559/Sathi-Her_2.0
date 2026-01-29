const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

/* --------------------------------------------------
   CREATE JOURNEY REQUEST
-------------------------------------------------- */
module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, departureTime, mode } = req.body;

    try {
        const ride = await rideService.createRide({
            user: req.user,
            pickup,
            destination,
            departureTime,
            mode
        });

        return res.status(201).json(ride);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};


/* --------------------------------------------------
   VERIFY MEETING OTP
   Used when companions meet physically
-------------------------------------------------- */
module.exports.verifyMeetingOtp = async (req, res) => {
    const { rideId, otp } = req.body;

    try {
        const verified = await rideService.verifyMeetingOtp({ rideId, otp });

        return res.status(200).json({
            message: 'Meeting verified',
            verified
        });

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};


/* --------------------------------------------------
   START JOURNEY
   Both companions verified → tracking ON
-------------------------------------------------- */
module.exports.startJourney = async (req, res) => {
    const { rideId } = req.body;

    try {
        const ride = await rideService.startJourney({ rideId });

        // notify matched companion
        if (ride.matchedWith?.socketId) {
            sendMessageToSocketId(ride.matchedWith.socketId, {
                event: 'journey-started',
                data: ride
            });
        }

        return res.status(200).json(ride);

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};


/* --------------------------------------------------
   END JOURNEY
-------------------------------------------------- */
module.exports.endJourney = async (req, res) => {
    const { rideId } = req.body;

    try {
        const ride = await rideService.endJourney({ rideId });

        // notify companion
        if (ride.matchedWith?.socketId) {
            sendMessageToSocketId(ride.matchedWith.socketId, {
                event: 'journey-ended',
                data: ride
            });
        }

        return res.status(200).json(ride);

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
