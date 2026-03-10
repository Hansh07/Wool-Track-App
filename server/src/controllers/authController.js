const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const permissionsConfig = require('../config/permissions.json');

// Always return live permissions from config so stale DB fields never block users
const livePermissions = (user) => permissionsConfig[user.role] || user.permissions || [];

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        const roleToAssign = role === 'ADMIN' ? 'FARMER' : (role || 'FARMER');
        const user = await User.create({ name, email, password, role: roleToAssign });
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        await RefreshToken.create({ token: refreshToken, user: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        res.status(201).json({
            _id: user._id, name: user.name, email: user.email,
            role: user.role, permissions: livePermissions(user),
            accessToken, refreshToken
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, twoFactorToken } = req.body;
        const user = await User.findOne({ email }).select('+password +twoFactorSecret +loginAttempts +lockUntil');
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.status(423).json({ message: 'Account locked. Try again later.' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            if (user.loginAttempts >= 5) user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
            await user.save();
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (user.twoFactorEnabled) {
            if (!twoFactorToken) return res.status(200).json({ requiresTwoFactor: true });
            const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token: twoFactorToken, window: 1 });
            if (!verified) return res.status(401).json({ message: 'Invalid 2FA code' });
        }
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        user.lastLogin = new Date();
        await user.save();
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        await RefreshToken.create({ token: refreshToken, user: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        res.json({
            _id: user._id, name: user.name, email: user.email,
            role: user.role, permissions: livePermissions(user),
            accessToken, refreshToken
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const refreshTokens = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });
        const stored = await RefreshToken.findOne({ token: refreshToken, isRevoked: false });
        if (!stored || stored.expiresAt < new Date()) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        stored.isRevoked = true;
        await stored.save();
        const newAccessToken = generateAccessToken(decoded.id);
        const newRefreshToken = generateRefreshToken(decoded.id);
        await RefreshToken.create({ token: newRefreshToken, user: decoded.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await RefreshToken.findOneAndUpdate({ token: refreshToken }, { isRevoked: true });
        }
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({
            _id: user._id, name: user.name, email: user.email,
            role: user.role, permissions: livePermissions(user),
            twoFactorEnabled: user.twoFactorEnabled,
            language: user.language, reputationScore: user.reputationScore
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const setup2FA = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({ name: `${process.env.APP_NAME || 'WoolMonitor'}:${req.user.email}`, length: 20 });
        await User.findByIdAndUpdate(req.user._id, { twoFactorSecret: secret.base32 });
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
        res.json({ secret: secret.base32, qrCode: qrCodeUrl });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const enable2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+twoFactorSecret');
        if (!user.twoFactorSecret) return res.status(400).json({ message: 'Run 2FA setup first' });
        const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token: req.body.token, window: 1 });
        if (!verified) return res.status(400).json({ message: 'Invalid code' });
        user.twoFactorEnabled = true;
        await user.save();
        res.json({ message: '2FA enabled successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const disable2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+twoFactorSecret');
        const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token: req.body.token, window: 1 });
        if (!verified) return res.status(400).json({ message: 'Invalid code' });
        user.twoFactorEnabled = false;
        user.twoFactorSecret = undefined;
        await user.save();
        res.json({ message: '2FA disabled successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { registerUser, loginUser, refreshTokens, logout, getMe, setup2FA, enable2FA, disable2FA };
