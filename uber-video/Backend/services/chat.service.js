const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const Ride = require('../models/ride.model');

const participantFields = 'fullname fullName profileImageUrl socketId';

const toId = (value) => String(value);

async function getMatchedRideOrThrow(rideId) {
    const ride = await Ride.findById(rideId).populate('user matchedWith', participantFields);

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (!ride.matchedWith) {
        throw new Error('Chat becomes available after a companion accepts the request');
    }

    return ride;
}

function ensureRideParticipants({ ride, userId, otherUserId }) {
    const rideParticipantIds = [ride.user?._id, ride.matchedWith?._id].filter(Boolean).map(toId);

    if (!rideParticipantIds.includes(toId(userId)) || !rideParticipantIds.includes(toId(otherUserId))) {
        throw new Error('Chat is only available for matched journey participants');
    }
}

async function getConversationForUser(conversationId, userId) {
    const conversation = await Conversation.findById(conversationId)
        .populate('participants', participantFields)
        .populate('ride');

    if (!conversation) {
        throw new Error('Conversation not found');
    }

    const isParticipant = conversation.participants.some((participant) => toId(participant._id) === toId(userId));

    if (!isParticipant) {
        throw new Error('You are not allowed to access this conversation');
    }

    return conversation;
}

module.exports.getOrCreateConversation = async ({ rideId, userId, otherUserId }) => {
    if (!rideId || !userId || !otherUserId) {
        throw new Error('Ride, user and companion are required');
    }

    if (toId(userId) === toId(otherUserId)) {
        throw new Error('You cannot start a chat with yourself');
    }

    const ride = await getMatchedRideOrThrow(rideId);
    ensureRideParticipants({ ride, userId, otherUserId });

    let conversation = await Conversation.findOne({ ride: rideId })
        .populate('participants', participantFields)
        .populate('ride');

    if (!conversation) {
        conversation = await Conversation.create({
            ride: rideId,
            participants: [ride.user._id, ride.matchedWith._id],
            lastMessageAt: new Date()
        });

        conversation = await Conversation.findById(conversation._id)
            .populate('participants', participantFields)
            .populate('ride');
    }

    return conversation;
};

module.exports.getMessages = async ({ conversationId, userId, limit = 50 }) => {
    await getConversationForUser(conversationId, userId);

    const parsedLimit = Number(limit) > 0 ? Math.min(Number(limit), 100) : 50;

    const messages = await Message.find({ conversation: conversationId })
        .populate('sender', participantFields)
        .populate('receiver', participantFields)
        .sort({ createdAt: -1 })
        .limit(parsedLimit);

    return messages.reverse();
};

module.exports.sendMessage = async ({ conversationId, senderId, text }) => {
    if (!conversationId || !senderId || !text?.trim()) {
        throw new Error('Conversation and message text are required');
    }

    const conversation = await getConversationForUser(conversationId, senderId);
    const receiver = conversation.participants.find((participant) => toId(participant._id) !== toId(senderId));

    if (!receiver) {
        throw new Error('Receiver not found for this conversation');
    }

    const trimmedText = text.trim();

    const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        receiver: receiver._id,
        text: trimmedText,
        status: receiver.socketId ? 'delivered' : 'sent',
        deliveredAt: receiver.socketId ? new Date() : undefined
    });

    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessageAt: new Date(),
        lastMessagePreview: trimmedText.slice(0, 280)
    });

    return Message.findById(message._id)
        .populate('sender', participantFields)
        .populate('receiver', participantFields);
};

module.exports.markConversationAsRead = async ({ conversationId, userId }) => {
    await getConversationForUser(conversationId, userId);

    const now = new Date();

    const result = await Message.updateMany(
        {
            conversation: conversationId,
            receiver: userId,
            status: { $ne: 'read' }
        },
        {
            $set: {
                status: 'read',
                deliveredAt: now,
                readAt: now
            }
        }
    );

    return {
        conversationId,
        updatedCount: result.modifiedCount || 0,
        readAt: now
    };
};
