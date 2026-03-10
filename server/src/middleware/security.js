const rateLimit = require('express-rate-limit');

// ─── Auth Rate Limiter ────────────────────────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});

// ─── API Rate Limiter ─────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: { success: false, message: 'Too many requests, please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// ─── Chat Rate Limiter ────────────────────────────────────────────────────────
const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: { success: false, message: 'Chat rate limit exceeded. Wait a moment.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// ─── Payment Rate Limiter ─────────────────────────────────────────────────────
const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { success: false, message: 'Payment attempt limit exceeded. Try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter, chatLimiter, paymentLimiter };
