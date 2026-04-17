const companionRequestModel = require('../models/companionRequest.model');
const rideModel = require('../models/ride.model');
const userModel = require('../models/user.model');

const REQUEST_EXPIRY_MINUTES = 30;

async function getRideForSender(rideId, senderId) {
    const ride = await rideModel.findById(rideId).populate('user matchedWith');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (String(ride.user._id) !== String(senderId)) {
        throw new Error('You can only manage requests for your own scheduled ride');
    }

    return ride;
}

module.exports.createCompanionRequest = async ({
    rideId,
    senderId,
    receiverId,
    message
}) => {
    if (!rideId || !senderId || !receiverId) {
        throw new Error('Ride, sender and receiver are required');
    }

    if (String(senderId) === String(receiverId)) {
        throw new Error('You cannot send a companion request to yourself');
    }

    const ride = await getRideForSender(rideId, senderId);

    if (!['scheduled', 'matched'].includes(ride.status)) {
        throw new Error('Companion requests can only be sent for scheduled rides');
    }

    if (ride.matchedWith) {
        throw new Error('This ride already has a matched companion');
    }

    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
        throw new Error('Requested companion not found');
    }

    if (!receiver.isVerified || receiver.gender !== 'female') {
        throw new Error('Only verified female users can receive companion requests');
    }

    const existingRequest = await companionRequestModel.findOne({
        ride: rideId,
        sender: senderId,
        receiver: receiverId
    });

    if (existingRequest && ['pending', 'accepted'].includes(existingRequest.status)) {
        throw new Error('A companion request for this user already exists');
    }

    const requestPayload = {
        ride: rideId,
        sender: senderId,
        receiver: receiverId,
        message,
        status: 'pending',
        expiresAt: new Date(Date.now() + REQUEST_EXPIRY_MINUTES * 60 * 1000)
    };

    const request = existingRequest
        ? await companionRequestModel.findByIdAndUpdate(existingRequest._id, requestPayload, { new: true })
        : await companionRequestModel.create(requestPayload);

    return companionRequestModel.findById(request._id)
        .populate('ride')
        .populate('sender', 'fullname fullName profileImageUrl socketId')
        .populate('receiver', 'fullname fullName profileImageUrl socketId');
};

module.exports.getIncomingRequests = async ({ userId }) => {
    return companionRequestModel.find({
        receiver: userId,
        status: { $in: ['pending', 'accepted', 'declined', 'cancelled'] }
    })
        .populate('ride')
        .populate('sender', 'fullname fullName profileImageUrl stats')
        .sort({ createdAt: -1 });
};

module.exports.getOutgoingRequests = async ({ userId }) => {
    return companionRequestModel.find({
        sender: userId,
        status: { $in: ['pending', 'accepted', 'declined', 'cancelled'] }
    })
        .populate('ride')
        .populate('receiver', 'fullname fullName profileImageUrl stats')
        .sort({ createdAt: -1 });
};

module.exports.acceptCompanionRequest = async ({ requestId, receiverId }) => {
    const request = await companionRequestModel.findById(requestId)
        .populate('ride')
        .populate('sender', 'fullname fullName profileImageUrl socketId')
        .populate('receiver', 'fullname fullName profileImageUrl socketId');

    if (!request) {
        throw new Error('Companion request not found');
    }

    if (String(request.receiver._id) !== String(receiverId)) {
        throw new Error('You are not allowed to accept this request');
    }

    if (request.status !== 'pending') {
        throw new Error('Only pending requests can be accepted');
    }

    if (request.expiresAt && request.expiresAt.getTime() < Date.now()) {
        request.status = 'expired';
        request.respondedAt = new Date();
        await request.save();
        throw new Error('This companion request has expired');
    }

    const ride = await rideModel.findById(request.ride._id);
    if (!ride) {
        throw new Error('Associated ride not found');
    }

    if (!['scheduled', 'matched'].includes(ride.status)) {
        throw new Error('This ride is no longer accepting companion requests');
    }

    ride.matchedWith = receiverId;
    ride.status = 'matched';
    await ride.save();

    request.status = 'accepted';
    request.respondedAt = new Date();
    await request.save();

    await companionRequestModel.updateMany(
        {
            ride: ride._id,
            _id: { $ne: request._id },
            status: 'pending'
        },
        {
            $set: {
                status: 'expired',
                respondedAt: new Date()
            }
        }
    );

    return companionRequestModel.findById(request._id)
        .populate('ride')
        .populate('sender', 'fullname fullName profileImageUrl socketId')
        .populate('receiver', 'fullname fullName profileImageUrl socketId');
};

module.exports.declineCompanionRequest = async ({ requestId, receiverId }) => {
    const request = await companionRequestModel.findById(requestId)
        .populate('ride')
        .populate('sender', 'fullname fullName profileImageUrl socketId')
        .populate('receiver', 'fullname fullName profileImageUrl socketId');

    if (!request) {
        throw new Error('Companion request not found');
    }

    if (String(request.receiver._id) !== String(receiverId)) {
        throw new Error('You are not allowed to decline this request');
    }

    if (request.status !== 'pending') {
        throw new Error('Only pending requests can be declined');
    }

    request.status = 'declined';
    request.respondedAt = new Date();
    await request.save();

    return companionRequestModel.findById(request._id)
        .populate('ride')
        .populate('sender', 'fullname fullName profileImageUrl socketId')
        .populate('receiver', 'fullname fullName profileImageUrl socketId');
};

module.exports.cancelCompanionRequest = async ({ requestId, senderId }) => {
    const request = await companionRequestModel.findById(requestId)
        .populate('ride')
        .populate('sender', 'fullname fullName profileImageUrl socketId')
        .populate('receiver', 'fullname fullName profileImageUrl socketId');

    if (!request) {
        throw new Error('Companion request not found');
    }

    if (String(request.sender._id) !== String(senderId)) {
        throw new Error('You are not allowed to cancel this request');
    }

    if (request.status !== 'pending') {
        throw new Error('Only pending requests can be cancelled');
    }

    request.status = 'cancelled';
    request.respondedAt = new Date();
    await request.save();

    return companionRequestModel.findById(request._id)
        .populate('ride')
        .populate('sender', 'fullname fullName profileImageUrl socketId')
        .populate('receiver', 'fullname fullName profileImageUrl socketId');
};
