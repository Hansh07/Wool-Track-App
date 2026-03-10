const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshTokens, logout, getMe, setup2FA, enable2FA, disable2FA } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const registerValidation = [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase and number'),
    body('role').optional().isIn(['FARMER', 'MILL_OPERATOR', 'QUALITY_INSPECTOR', 'BUYER']).withMessage('Invalid role'),
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
];

router.post('/register', authLimiter, registerValidation, validate, registerUser);
router.post('/login', authLimiter, loginValidation, validate, loginUser);
router.post('/refresh', refreshTokens);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/2fa/setup', protect, setup2FA);
router.post('/2fa/enable', protect, body('token').isLength({ min: 6, max: 6 }).withMessage('6-digit code required'), validate, enable2FA);
router.post('/2fa/disable', protect, body('token').isLength({ min: 6, max: 6 }).withMessage('6-digit code required'), validate, disable2FA);

module.exports = router;
