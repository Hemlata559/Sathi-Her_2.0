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

router.post(
    '/verify-face',
    authMiddleware.authVerifiedFemale,
    body('rideId')
        .isMongoId()
        .withMessage('Invalid journey id'),
    body('selfieImageUrl')
        .isString()
        .isLength({ min: 20 })
        .withMessage('A captured companion image is required'),
    body('referenceImageUrl')
        .isString()
        .isLength({ min: 5 })
        .withMessage('A reference companion image is required'),
    body('similarityScore')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Similarity score must be between 0 and 100'),
    body('faceVerified')
        .isBoolean()
        .withMessage('Face verification status is required'),
    rideController.verifyCompanionFaceMatch
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

router.get(
    '/:rideId/live-tracking',
    authMiddleware.authVerifiedFemale,
    rideController.getLiveTracking
);

module.exports = router;
