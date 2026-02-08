const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model');

/* --------------------------------------------------
   COMMON TOKEN EXTRACT FUNCTION
-------------------------------------------------- */
function getToken(req) {
    return req.cookies.token || req.headers.authorization?.split(' ')[1];
}


/* --------------------------------------------------
   BASIC USER AUTH
   - Token valid?
   - Not blacklisted?
   - User exists?
-------------------------------------------------- */
module.exports.authUser = async (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token' });
    }

    try {
        // blacklist check
        const isBlacklisted = await blackListTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Session expired' });
        }

        // verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};


/* --------------------------------------------------
   VERIFIED FEMALE ONLY ACCESS
   - Use on companion / journey routes
-------------------------------------------------- */
module.exports.authVerifiedFemale = async (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token' });
    }

    try {
        const isBlacklisted = await blackListTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Session expired' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // safety rule
        if (!user.isVerified || user.gender !== 'female') {
            return res.status(403).json({ message: 'Access restricted' });
        }

        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
