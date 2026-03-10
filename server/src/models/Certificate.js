const mongoose = require('mongoose');
const crypto = require('crypto');

const certificateSchema = new mongoose.Schema({
    certificateNumber: { type: String, unique: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'WoolBatch', required: true },
    qualityReport: { type: mongoose.Schema.Types.ObjectId, ref: 'QualityReport' },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issuedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['Quality', 'Origin', 'Organic', 'RWS', 'IWTO', 'ESG'],
        required: true,
    },
    grade: { type: String },
    woolType: { type: String },
    weight: { type: Number },
    fiberDiameter: { type: Number },
    cleanWoolYield: { type: Number },
    origin: { type: String },
    validUntil: { type: Date },
    isRevoked: { type: Boolean, default: false },
    revokedReason: { type: String },

    // Blockchain traceability hash
    blockchainHash: { type: String },
    blockchainTxId: { type: String },

    // QR code / verification
    verificationUrl: { type: String },
    qrCode: { type: String }, // base64 QR image

    metadata: { type: Map, of: String },
}, { timestamps: true });

// Auto-generate certificate number
certificateSchema.pre('save', function (next) {
    if (this.isNew && !this.certificateNumber) {
        const year = new Date().getFullYear();
        const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
        this.certificateNumber = `WM-${this.type.substring(0, 3).toUpperCase()}-${year}-${rand}`;
    }
    next();
});

// certificateNumber index is already created by unique:true on the field definition
certificateSchema.index({ batch: 1 });
certificateSchema.index({ type: 1 });

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
