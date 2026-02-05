const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },

    firstName: String,
    middleName: String,
    lastName: String,

    age: Number,
    gender: String,

    pincode: String,
    address: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);
