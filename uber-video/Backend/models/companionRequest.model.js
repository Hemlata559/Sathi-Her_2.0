const mongoose = require('mongoose');

const companionRequestStatusEnum = [
    'pending',
    'accepted',
    'declined',
    'cancelled',
    'expired'
];

const companionRequestSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ride',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: companionRequestStatusEnum,
        default: 'pending'
    },
    message: {
        type: String,
        trim: true,
        maxlength: 500
    },
    respondedAt: {
        type: Date
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

companionRequestSchema.index({ receiver: 1, status: 1, createdAt: -1 });
companionRequestSchema.index({ sender: 1, status: 1, createdAt: -1 });
companionRequestSchema.index({ ride: 1, sender: 1, receiver: 1 }, { unique: true });

module.exports = mongoose.model('companionRequest', companionRequestSchema);
