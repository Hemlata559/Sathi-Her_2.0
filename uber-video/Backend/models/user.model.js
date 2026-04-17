const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const emergencyContactSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    relationship: {
        type: String,
        trim: true
    }
}, { _id: false });

const userSchema = new mongoose.Schema({

    /* ----------------------------------
       BASIC PROFILE
    ---------------------------------- */
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        }
    },

    email: {
        type: String,
        unique: true,
        sparse: true, // allows null if using mobile instead
        minlength: [5, 'Email must be at least 5 characters long'],
    },

    mobile: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    /* ----------------------------------
       GENDER & ROLE (Women-only filter)
    ---------------------------------- */
    gender: {
        type: String,
        enum: ['female', 'male', 'other'],
        required: true
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    age: {
        type: Number,
        min: 18,
        max: 120
    },

    collegeName: {
        type: String,
        trim: true
    },

    contactNumber: {
        type: String,
        trim: true
    },

    profileImageUrl: {
        type: String,
        trim: true
    },

    bio: {
        type: String,
        trim: true,
        maxlength: 280
    },

    /* ----------------------------------
       VERIFICATION FLAGS
    ---------------------------------- */
    isVerified: {
        type: Boolean,
        default: false
    },

    idVerified: {
        type: Boolean,
        default: false
    },

    faceVerified: {
        type: Boolean,
        default: false
    },

    /* ----------------------------------
       OTP FOR LOGIN / MOBILE VERIFY
    ---------------------------------- */
    otpHash: {
        type: String,
        select: false
    },

    otpExpiry: {
        type: Date,
        select: false
    },

    /* ----------------------------------
       SAFETY & TRUST
    ---------------------------------- */
    trustScore: {
        type: Number,
        default: 50, // start mid
        min: 0,
        max: 100
    },

    emergencyContacts: [emergencyContactSchema],

    preferences: {
        maxCompanionDistanceKm: {
            type: Number,
            default: 3,
            min: 0
        },
        minPreferredRating: {
            type: Number,
            default: 4,
            min: 0,
            max: 5
        },
        allowsCompanionRequests: {
            type: Boolean,
            default: true
        }
    },

    stats: {
        completedJourneys: {
            type: Number,
            default: 0
        },
        totalRatings: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        }
    },

    /* ----------------------------------
       REAL-TIME CONNECTION
    ---------------------------------- */
    socketId: {
        type: String,
    },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

/* ----------------------------------
   PRE-SAVE HOOK - Remove null mobile
---------------------------------- */
userSchema.pre('save', function (next) {
    if (!this.mobile || this.mobile.trim() === '') {
        this.mobile = undefined; // Don't store null - use undefined instead
    }
    if (!this.email || this.email.trim() === '') {
        this.email = undefined;
    }
    next();
});

userSchema.virtual('fullName').get(function () {
    return {
        firstName: this.fullname?.firstname || '',
        lastName: this.fullname?.lastname || ''
    };
});

userSchema.virtual('profile').get(function () {
    return {
        id: this._id,
        email: this.email,
        mobile: this.mobile,
        fullName: this.fullName,
        profileImageUrl: this.profileImageUrl,
        age: this.age,
        collegeName: this.collegeName,
        contactNumber: this.contactNumber,
        emergencyContacts: this.emergencyContacts,
        isVerified: this.isVerified,
        idVerified: this.idVerified,
        faceVerified: this.faceVerified,
        trustScore: this.trustScore,
        stats: this.stats,
        preferences: this.preferences,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
});

/* ----------------------------------
   AUTH TOKEN GENERATION
---------------------------------- */
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

/* ----------------------------------
   PASSWORD COMPARE
---------------------------------- */
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

/* ----------------------------------
   PASSWORD HASH
---------------------------------- */
userSchema.statics.hashPassword = async function (password) {
    return bcrypt.hash(password, 10);
};

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
