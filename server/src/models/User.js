const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const permissionsConfig = require('../config/permissions.json');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
        type: String,
        enum: ['FARMER', 'MILL_OPERATOR', 'QUALITY_INSPECTOR', 'BUYER', 'ADMIN'],
        default: 'FARMER',
    },
    permissions: [{ type: String }],

    // Profile
    phone: { type: String },
    avatar: { type: String },
    location: { type: String },
    language: { type: String, enum: ['en', 'hi', 'pa'], default: 'en' },

    // Account status
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },

    // 2FA (Two-Factor Authentication via TOTP/Speakeasy)
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },

    // Security tracking
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLogin: { type: Date },
    lastLoginIp: { type: String },

    // Reputation
    reputationScore: { type: Number, default: 100, min: 0, max: 1000 },
    totalTransactions: { type: Number, default: 0 },

}, { timestamps: true });

// ─── Indexes ──────────────────────────────────────────────────────────────────
// email index is already created by unique:true on the field definition
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// ─── Set permissions from role on save ────────────────────────────────────────
userSchema.pre('save', function (next) {
    if (this.isModified('role') || this.isNew) {
        this.permissions = permissionsConfig[this.role] || [];
    }
    next();
});

// ─── Hash password before save ────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ─── Compare password ─────────────────────────────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Account lock check ───────────────────────────────────────────────────────
userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.statics.getPermissionsForRole = function (role) {
    return permissionsConfig[role] || [];
};

const User = mongoose.model('User', userSchema);
module.exports = User;
