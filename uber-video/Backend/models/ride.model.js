const mongoose = require('mongoose');

const rideStatusEnum = [
    'draft',
    'scheduled',
    'matched',
    'verified',
    'in_progress',
    'completed',
    'cancelled'
];

const liveLocationSchema = new mongoose.Schema({
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    updatedAt: {
        type: Date
    }
}, { _id: false });

const rideSchema = new mongoose.Schema({

    /* ----------------------------------
       USER WHO CREATED JOURNEY REQUEST
    ---------------------------------- */
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    /* ----------------------------------
       MATCHED COMPANION USER
       (null until match happens)
    ---------------------------------- */
    matchedWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },

    /* ----------------------------------
       LOCATION DETAILS
    ---------------------------------- */
    pickup: {
        type: String,
        required: true,
        trim: true
    },

    destination: {
        type: String,
        required: true,
        trim: true
    },

    /* ----------------------------------
       TRAVEL DETAILS
    ---------------------------------- */
    departureTime: {
        type: Date,
        required: true
    },

    scheduleLabel: {
        type: String,
        trim: true
    },

    mode: {
        type: String,
        enum: ['bus', 'metro', 'cab', 'walk', 'mixed'],
        required: true
    },

    /* ----------------------------------
       JOURNEY STATUS FLOW
       draft -> scheduled -> matched -> verified -> in_progress -> completed
    ---------------------------------- */
    status: {
        type: String,
        enum: rideStatusEnum,
        default: 'scheduled'
    },

    requestWindowEndsAt: {
        type: Date
    },

    /* ----------------------------------
       ROUTE ANALYTICS (OPTIONAL)
       Future AI / safety scoring
    ---------------------------------- */
    duration: {
        type: Number
    },

    distance: {
        type: Number
    },

    /* ----------------------------------
       MEETING POINT OTP VERIFICATION
       Used when companions meet physically
    ---------------------------------- */
    meetOtp: {
        type: String,
        select: false
    },

    meetOtpExpiry: {
        type: Date,
        select: false
    },

    meetVerified: {
        type: Boolean,
        default: false
    },

    /* ----------------------------------
       JOURNEY SESSION TIMES
    ---------------------------------- */
    startedAt: {
        type: Date
    },

    completedAt: {
        type: Date
    },

    /* ----------------------------------
       SAFETY / TRACKING FLAGS
    ---------------------------------- */
    liveTracking: {
        type: Boolean,
        default: false
    },

    liveLocations: {
        user: liveLocationSchema,
        companion: liveLocationSchema
    },

    anomalyDetected: {
        type: Boolean,
        default: false
    },

    /* ----------------------------------
       FEEDBACK / TRUST SCORE
       Future expansion
    ---------------------------------- */
    rating: {
        type: Number,
        min: 1,
        max: 5
    }

}, { timestamps: true });

rideSchema.index({ user: 1, status: 1, departureTime: 1 });
rideSchema.index({ matchedWith: 1, status: 1 });

module.exports = mongoose.model('ride', rideSchema);
