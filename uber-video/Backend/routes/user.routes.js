const express = require('express');
const router = express.Router();
const { body } = require("express-validator");

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');


/* --------------------------------------------------
   REGISTER USER
   - Email OR Mobile
   - Gender required
-------------------------------------------------- */
router.post(
    '/register',
    [
        body('fullname.firstname')
            .isLength({ min: 3 })
            .withMessage('First name must be at least 3 characters'),

        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),

        body('gender')
            .isIn(['female', 'male', 'other'])
            .withMessage('Invalid gender'),

        body().custom(value => {
            if (!value.email && !value.mobile) {
                throw new Error('Email or Mobile required');
            }
            return true;
        })
    ],
    userController.registerUser
);


/* --------------------------------------------------
   LOGIN USER
   - Email OR Mobile
-------------------------------------------------- */
router.post(
    '/login',
    [
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),

        body().custom(value => {
            if (!value.email && !value.mobile) {
                throw new Error('Email or Mobile required');
            }
            return true;
        })
    ],
    userController.loginUser
);


/* --------------------------------------------------
   GET PROFILE
-------------------------------------------------- */
router.get(
    '/profile',
    authMiddleware.authUser,
    userController.getUserProfile
);


/* --------------------------------------------------
   LOGOUT USER
   POST used instead of GET for security
-------------------------------------------------- */
router.post(
    '/logout',
    authMiddleware.authUser,
    userController.logoutUser
);

module.exports = router;
