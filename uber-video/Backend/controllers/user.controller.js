const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');


/* --------------------------------------------------
   REGISTER USER
-------------------------------------------------- */
module.exports.registerUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, mobile, password, gender } = req.body;

    // check existing
    const existingUser = await userModel.findOne({
        $or: [{ email }, { mobile }]
    });

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        mobile,
        gender,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({
        token,
        user,
        message: 'Registered successfully'
    });
};


/* --------------------------------------------------
   LOGIN USER (EMAIL OR MOBILE)
-------------------------------------------------- */
module.exports.loginUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, mobile, password } = req.body;

    const user = await userModel
        .findOne({
            $or: [{ email }, { mobile }]
        })
        .select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = user.generateAuthToken();

    // secure cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: 'lax'
    });

    res.status(200).json({ token, user });
};


/* --------------------------------------------------
   GET PROFILE
-------------------------------------------------- */
module.exports.getUserProfile = async (req, res) => {
    res.status(200).json(req.user);
};


/* --------------------------------------------------
   LOGOUT USER
-------------------------------------------------- */
module.exports.logoutUser = async (req, res) => {

    const token =
        req.cookies.token ||
        req.headers.authorization?.split(' ')[1];

    if (token) {
        await blackListTokenModel.create({ token });
    }

    res.clearCookie('token');

    res.status(200).json({ message: 'Logged out successfully' });
};
