const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const permissionsConfig = require('../config/permissions.json');

// ─── Verify Access Token ──────────────────────────────────────────────────────
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password -twoFactorSecret');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account deactivated. Contact admin.' });
        }

        // Always derive permissions from role config so stale DB values never block access
        req.user = user;
        req.user.permissions = permissionsConfig[user.role] || user.permissions || [];
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Access token expired', code: 'TOKEN_EXPIRED' });
        }
        logger.warn(`Auth middleware error: ${error.message}`);
        return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
};

// ─── Check Permission ─────────────────────────────────────────────────────────
const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const hasPermission = req.user.role === 'ADMIN' ||
            (Array.isArray(requiredPermission)
                ? requiredPermission.some(p => req.user.permissions?.includes(p))
                : req.user.permissions?.includes(requiredPermission));

        if (hasPermission) {
            return next();
        }
        return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
    };
};

// ─── Require Role ─────────────────────────────────────────────────────────────
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `Access restricted to: ${roles.join(', ')}` });
        }
        next();
    };
};

module.exports = { protect, checkPermission, requireRole };
