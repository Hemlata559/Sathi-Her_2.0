const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        sparse: true
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

    emergencyContacts: [
        {
            name: String,
            mobile: String
        }
    ],

    /* ----------------------------------
       REAL-TIME CONNECTION
    ---------------------------------- */
    socketId: {
        type: String,
    },

}, { timestamps: true });

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
