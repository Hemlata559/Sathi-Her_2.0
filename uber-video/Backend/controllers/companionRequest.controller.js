const { validationResult } = require('express-validator');
const { sendMessageToSocketId } = require('../socket');
const companionRequestService = require('../services/companionRequest.service');

module.exports.createCompanionRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const request = await companionRequestService.createCompanionRequest({
            rideId: req.body.rideId,
            senderId: req.user._id,
            receiverId: req.body.receiverId,
            message: req.body.message
        });

        if (request.receiver?.socketId) {
            sendMessageToSocketId(request.receiver.socketId, {
                event: 'companion-request',
                data: request
            });
        }

        return res.status(201).json(request);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports.getIncomingRequests = async (req, res) => {
    try {
        const requests = await companionRequestService.getIncomingRequests({
            userId: req.user._id
        });

        return res.status(200).json(requests);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getOutgoingRequests = async (req, res) => {
    try {
        const requests = await companionRequestService.getOutgoingRequests({
            userId: req.user._id
        });

        return res.status(200).json(requests);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.acceptCompanionRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const request = await companionRequestService.acceptCompanionRequest({
            requestId: req.params.requestId,
            receiverId: req.user._id
        });

        if (request.sender?.socketId) {
            sendMessageToSocketId(request.sender.socketId, {
                event: 'companion-request-accepted',
                data: request
            });
        }

        return res.status(200).json(request);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports.declineCompanionRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const request = await companionRequestService.declineCompanionRequest({
            requestId: req.params.requestId,
            receiverId: req.user._id
        });

        if (request.sender?.socketId) {
            sendMessageToSocketId(request.sender.socketId, {
                event: 'companion-request-declined',
                data: request
            });
        }

        return res.status(200).json(request);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports.cancelCompanionRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const request = await companionRequestService.cancelCompanionRequest({
            requestId: req.params.requestId,
            senderId: req.user._id
        });

        if (request.receiver?.socketId) {
            sendMessageToSocketId(request.receiver.socketId, {
                event: 'companion-request-cancelled',
                data: request
            });
        }

        return res.status(200).json(request);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
