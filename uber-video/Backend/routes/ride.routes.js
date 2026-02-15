const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');

const authMiddleware = require('../middlewares/auth.middleware');
const rideController = require('../controllers/ride.controller');


/* --------------------------------------------------
   GET FARE CALCULATION
-------------------------------------------------- */
router.get(
    '/get-fare',
    authMiddleware.authVerifiedFemale,
    query('pickup')
        .isString()
        .isLength({ min: 3 })
        .withMessage('Invalid pickup address'),
    query('destination')
        .isString()
        .isLength({ min: 3 })
        .withMessage('Invalid destination address'),
    rideController.getFare
);


/* --------------------------------------------------
   CREATE JOURNEY REQUEST
-------------------------------------------------- */
router.post(
    '/create',
    authMiddleware.authVerifiedFemale, // only verified female users
    body('pickup')
        .isString()
        .isLength({ min: 3 })
        .withMessage('Invalid pickup address'),

    body('destination')
        .isString()
        .isLength({ min: 3 })
        .withMessage('Invalid destination address'),

    body('departureTime')
        .isISO8601()
        .withMessage('Invalid departure time'),

    body('mode')
        .isString()
        .isIn(['bus', 'metro', 'cab', 'walk', 'mixed'])
        .withMessage('Invalid travel mode'),

    rideController.createRide
);


/* --------------------------------------------------
   VERIFY MEETING OTP
   Used when companions meet physically
-------------------------------------------------- */
router.post(
    '/verify-otp',
    authMiddleware.authVerifiedFemale,
    body('rideId')
        .isMongoId()
        .withMessage('Invalid journey id'),

    body('otp')
        .isLength({ min: 6, max: 6 })
        .withMessage('Invalid OTP'),

    rideController.verifyMeetingOtp
);


/* --------------------------------------------------
   START JOURNEY
-------------------------------------------------- */
router.post(
    '/start',
    authMiddleware.authVerifiedFemale,
    body('rideId')
        .isMongoId()
        .withMessage('Invalid journey id'),

    rideController.startJourney
);


/* --------------------------------------------------
   END JOURNEY
-------------------------------------------------- */
router.post(
    '/end',
    authMiddleware.authVerifiedFemale,
    body('rideId')
        .isMongoId()
        .withMessage('Invalid journey id'),

    rideController.endJourney
);

module.exports = router;
