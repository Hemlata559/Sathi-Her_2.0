const chatService = require('../services/chat.service');
const { sendMessageToSocketId } = require('../socket');
const User = require('../models/user.model');

module.exports.sendMessage = async (req, res) => {
    try {
        const { chatId, text, receiverId } = req.body;

        const message = await chatService.sendMessage({
            chatId,
            senderId: req.user._id,
            text
        });

        // find receiver
        const receiver = await User.findById(receiverId);

        if (receiver?.socketId) {
            sendMessageToSocketId(receiver.socketId, {
                event: 'new-message',
                data: message
            });
        }

        return res.status(200).json(message);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
