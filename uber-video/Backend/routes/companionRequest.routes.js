const express = require('express');
const { body, param } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const companionRequestController = require('../controllers/companionRequest.controller');

const router = express.Router();

router.post(
    '/',
    authMiddleware.authVerifiedFemale,
    body('rideId')
        .isMongoId()
        .withMessage('Invalid ride id'),
    body('receiverId')
        .isMongoId()
        .withMessage('Invalid receiver id'),
    body('message')
        .optional()
        .isString()
        .isLength({ max: 500 })
        .withMessage('Message must be under 500 characters'),
    companionRequestController.createCompanionRequest
);

router.get(
    '/incoming',
    authMiddleware.authVerifiedFemale,
    companionRequestController.getIncomingRequests
);

router.get(
    '/outgoing',
    authMiddleware.authVerifiedFemale,
    companionRequestController.getOutgoingRequests
);

router.patch(
    '/:requestId/accept',
    authMiddleware.authVerifiedFemale,
    param('requestId')
        .isMongoId()
        .withMessage('Invalid request id'),
    companionRequestController.acceptCompanionRequest
);

router.patch(
    '/:requestId/decline',
    authMiddleware.authVerifiedFemale,
    param('requestId')
        .isMongoId()
        .withMessage('Invalid request id'),
    companionRequestController.declineCompanionRequest
);

router.patch(
    '/:requestId/cancel',
    authMiddleware.authVerifiedFemale,
    param('requestId')
        .isMongoId()
        .withMessage('Invalid request id'),
    companionRequestController.cancelCompanionRequest
);

module.exports = router;
