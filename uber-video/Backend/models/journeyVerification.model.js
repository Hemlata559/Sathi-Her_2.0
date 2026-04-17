const mongoose = require('mongoose');

const journeyVerificationSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ride',
        required: true,
        unique: true
    },
    users: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        selfieImageUrl: {
            type: String,
            trim: true
        },
        referenceImageUrl: {
            type: String,
            trim: true
        },
        similarityScore: {
            type: Number,
            min: 0,
            max: 100
        },
        faceVerified: {
            type: Boolean,
            default: false
        },
        verifiedAt: {
            type: Date
        }
    }],
    meetOtpVerified: {
        type: Boolean,
        default: false
    },
    verifiedForStart: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

journeyVerificationSchema.index({ 'users.user': 1, updatedAt: -1 });

module.exports = mongoose.model('journeyVerification', journeyVerificationSchema);
