const mongoose = require('mongoose');
const crypto = require('crypto');

const woolBatchSchema = mongoose.Schema({
    batchId: {
        type: String,
        required: true,
        unique: true,
        // crypto gives 4 billion+ combinations vs 10,000 from Math.random
        default: () => 'BATCH-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    qualityReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QualityReport',
    },
    woolType: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
    }],
    weight: {
        type: Number,
        required: true, // in kg
    },
    moisture: {
        type: Number, // percentage
    },
    source: {
        type: String,
    },
    isSold: {
        type: Boolean,
        default: false,
    },
    dateReceived: {
        type: Date,
        default: Date.now,
    },
    currentStage: {
        type: String,
        enum: ['RAW', 'Cleaning', 'Carding', 'Spinning', 'Finished'],
        default: 'RAW',
    },
    qualityStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    financials: {
        basePricePerKg: { type: Number, default: 0 },
        qualityBonus: { type: Number, default: 0 },
        grossRevenue: { type: Number, default: 0 },
        serviceFees: {
            inspection: { type: Number, default: 50 },
            processing: { type: Number, default: 0 },
            platform: { type: Number, default: 0 }
        },
        netFarmerEarnings: { type: Number, default: 0 }
    },
    processingLogs: [{
        stage: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
        operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
}, {
    timestamps: true,
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
woolBatchSchema.index({ creator: 1 });
woolBatchSchema.index({ farmerId: 1 });
woolBatchSchema.index({ qualityStatus: 1 });
woolBatchSchema.index({ currentStage: 1 });
woolBatchSchema.index({ isSold: 1 });
// Compound index for marketplace query pattern
woolBatchSchema.index({ currentStage: 1, qualityStatus: 1, isSold: 1 });

const WoolBatch = mongoose.model('WoolBatch', woolBatchSchema);

module.exports = WoolBatch;
