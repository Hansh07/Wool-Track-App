const mongoose = require('mongoose');

const esgSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'WoolBatch' },
    reportPeriod: { type: String, required: true }, // e.g., "Q1-2025"

    // Environmental
    environmental: {
        waterUsageLiters: { type: Number },
        energyUsageKwh: { type: Number },
        carbonFootprintKg: { type: Number },
        renewableEnergyPercent: { type: Number },
        wasteRecycledPercent: { type: Number },
        chemicalsUsed: [{ name: String, quantity: Number, unit: String }],
        pastureLandHectares: { type: Number },
        organicCertified: { type: Boolean, default: false },
        animalWelfareScore: { type: Number, min: 0, max: 100 },
    },

    // Social
    social: {
        farmWorkers: { type: Number },
        womenEmployedPercent: { type: Number },
        averageWageUSD: { type: Number },
        safetyIncidents: { type: Number, default: 0 },
        trainingHoursPerWorker: { type: Number },
        communityInvestmentUSD: { type: Number },
        fairTradeCertified: { type: Boolean, default: false },
    },

    // Governance
    governance: {
        complianceScore: { type: Number, min: 0, max: 100 },
        auditsPassed: { type: Number },
        certifications: [{ type: String }],
        supplyChainTransparency: { type: Boolean, default: false },
    },

    // Overall ESG score (calculated)
    overallScore: { type: Number, min: 0, max: 100 },
    rating: { type: String, enum: ['A+', 'A', 'B+', 'B', 'C', 'D'], default: 'B' },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

esgSchema.index({ farmer: 1, reportPeriod: 1 });

const ESGReport = mongoose.model('ESGReport', esgSchema);
module.exports = ESGReport;
