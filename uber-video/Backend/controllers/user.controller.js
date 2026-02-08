const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');


/* --------------------------------------------------
   REGISTER USER
-------------------------------------------------- */
module.exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, mobile, password, gender } = req.body;

        // Trim email and mobile
        const trimmedEmail = email ? email.trim().toLowerCase() : null;
        const trimmedMobile = mobile ? mobile.trim() : null;

        console.log('Register attempt - Email:', trimmedEmail, 'Mobile:', trimmedMobile);

        // Build query for existing user
        const query = [];
        if (trimmedEmail) query.push({ email: trimmedEmail });
        if (trimmedMobile) query.push({ mobile: trimmedMobile });

        let existingUser = null;
        if (query.length > 0) {
            existingUser = await userModel.findOne({ $or: query });
        }

        if (existingUser) {
            console.log('User already exists:', existingUser.email || existingUser.mobile);
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await userModel.hashPassword(password);

        const userData = {
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            password: hashedPassword,
            gender
        };

        // Only add email and mobile if they exist
        if (trimmedEmail) userData.email = trimmedEmail;
        if (trimmedMobile) userData.mobile = trimmedMobile;

        const user = await userService.createUser(userData);

        const token = user.generateAuthToken();

        res.status(201).json({
            token,
            user,
            message: 'Registered successfully'
        });
    } catch (error) {
        console.error('Register error:', error.message);
        
        // Handle E11000 duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                message: `This ${field} is already registered` 
            });
        }
        
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
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
