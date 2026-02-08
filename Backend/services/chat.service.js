const Chat = require('../models/chat.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');

/* --------------------------------------------------
   CREATE OR GET CHAT ROOM BETWEEN TWO USERS
-------------------------------------------------- */
module.exports.getOrCreateChat = async (userAId, userBId) => {

    if (!userAId || !userBId) {
        throw new Error('User IDs required');
    }

    // prevent self chat
    if (userAId.toString() === userBId.toString()) {
        throw new Error('Invalid users');
    }

    // check existing room
    let chat = await Chat.findOne({
        participants: { $all: [userAId, userBId] }
    });

    if (!chat) {
        chat = await Chat.create({
            participants: [userAId, userBId]
        });
    }

    return chat;
};


/* --------------------------------------------------
   SEND MESSAGE
-------------------------------------------------- */
module.exports.sendMessage = async ({
    chatId,
    senderId,
    text
}) => {

    if (!chatId || !senderId || !text) {
        throw new Error('Missing fields');
    }

    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error('Chat not found');

    // ensure sender is participant
    if (!chat.participants.includes(senderId)) {
        throw new Error('Unauthorized');
    }

    const message = await Message.create({
        chat: chatId,
        sender: senderId,
        text
    });

    // update last message
    chat.lastMessage = message._id;
    chat.updatedAt = new Date();
    await chat.save();

    return message;
};


/* --------------------------------------------------
   GET CHAT MESSAGES
-------------------------------------------------- */
module.exports.getMessages = async (chatId, limit = 50) => {

    if (!chatId) throw new Error('Chat ID required');

    const messages = await Message.find({ chat: chatId })
        .populate('sender', 'fullname socketId')
        .sort({ createdAt: -1 })
        .limit(limit);

    return messages.reverse();
};


/* --------------------------------------------------
   DELETE MESSAGE (OPTIONAL SAFETY FEATURE)
-------------------------------------------------- */
module.exports.deleteMessage = async (messageId, userId) => {

    const message = await Message.findById(messageId);
    if (!message) throw new Error('Message not found');

    if (message.sender.toString() !== userId.toString()) {
        throw new Error('Not allowed');
    }

    await message.deleteOne();
    return true;
};
