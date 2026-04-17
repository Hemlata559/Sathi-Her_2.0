const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware.authUser);

router.post(
    '/conversations',
    [
        body('rideId').notEmpty().withMessage('Ride ID is required'),
        body('otherUserId').notEmpty().withMessage('Companion user ID is required')
    ],
    chatController.getOrCreateConversation
);

router.get(
    '/conversations/:conversationId/messages',
    [param('conversationId').notEmpty().withMessage('Conversation ID is required')],
    chatController.getMessages
);

router.post(
    '/messages',
    [
        body('conversationId').notEmpty().withMessage('Conversation ID is required'),
        body('text').trim().notEmpty().withMessage('Message text is required')
    ],
    chatController.sendMessage
);

router.patch(
    '/conversations/:conversationId/read',
    [param('conversationId').notEmpty().withMessage('Conversation ID is required')],
    chatController.markConversationAsRead
);

module.exports = router;
