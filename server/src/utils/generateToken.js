const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId, type: 'access' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '15m',
    });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    });
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// Legacy support - generates access token only
const generateToken = (userId) => generateAccessToken(userId);

module.exports = { generateToken, generateAccessToken, generateRefreshToken, verifyRefreshToken };
