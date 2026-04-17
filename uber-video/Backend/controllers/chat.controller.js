const { validationResult } = require('express-validator');
const chatService = require('../services/chat.service');
const { sendMessageToSocketId } = require('../socket');

module.exports.getOrCreateConversation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const conversation = await chatService.getOrCreateConversation({
            rideId: req.body.rideId,
            userId: req.user._id,
            otherUserId: req.body.otherUserId
        });

        return res.status(200).json(conversation);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports.getMessages = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const messages = await chatService.getMessages({
            conversationId: req.params.conversationId,
            userId: req.user._id,
            limit: req.query.limit
        });

        return res.status(200).json(messages);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports.sendMessage = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const message = await chatService.sendMessage({
            conversationId: req.body.conversationId,
            senderId: req.user._id,
            text: req.body.text
        });

        if (message.receiver?.socketId) {
            sendMessageToSocketId(message.receiver.socketId, {
                event: 'new-message',
                data: message
            });
        }

        return res.status(200).json(message);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports.markConversationAsRead = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const readResult = await chatService.markConversationAsRead({
            conversationId: req.params.conversationId,
            userId: req.user._id
        });

        return res.status(200).json(readResult);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
