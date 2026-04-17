const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversation',
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
    text: {
        type: String,
        trim: true,
        maxlength: 2000
    },
    attachments: [{
        url: String,
        mimeType: String,
        fileName: String
    }],
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    deliveredAt: {
        type: Date
    },
    readAt: {
        type: Date
    }
}, { timestamps: true });

messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ receiver: 1, status: 1 });

module.exports = mongoose.model('message', messageSchema);
