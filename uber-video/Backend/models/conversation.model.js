const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ride'
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    lastMessageAt: {
        type: Date
    },
    lastMessagePreview: {
        type: String,
        trim: true,
        maxlength: 280
    },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    }
}, { timestamps: true });

conversationSchema.index({ ride: 1 }, { sparse: true });
conversationSchema.index({ participants: 1, updatedAt: -1 });

module.exports = mongoose.model('conversation', conversationSchema);
