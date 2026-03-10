const { calculateRevenue } = require('../utils/revenueCalculator');
const QualityReport = require('../models/QualityReport');
const WoolBatch = require('../models/WoolBatch');

const createInspection = async (req, res) => {
    try {
        const { batchId, fiberDiameter, tensileStrength, colorGrade, cleanWoolYield, notes, decision } = req.body;

        const batch = await WoolBatch.findById(batchId);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });

        // Guard: only Finished batches are eligible for quality inspection
        if (batch.currentStage !== 'Finished') {
            return res.status(400).json({
                message: `Batch must be in Finished stage before inspection. Current stage: ${batch.currentStage}`,
            });
        }

        const report = await QualityReport.create({
            batch: batchId,
            inspector: req.user._id,
            fiberDiameter,
            tensileStrength,
            colorGrade,
            cleanWoolYield,
            notes,
            decision,
        });

        batch.qualityReport = report._id;
        batch.qualityStatus = decision;

        const batchData = batch.toObject();
        batchData.qualityReport = report.toObject();
        batch.financials = calculateRevenue(batchData);

        await batch.save();
        res.status(201).json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMyQualityReports = async (req, res) => {
    try {
        const farmerId = req.user._id;
        const batches = await WoolBatch.find({
            $or: [{ farmerId }, { creator: farmerId }],
            qualityReport: { $exists: true, $ne: null }
        }).populate('qualityReport');

        const results = batches.map(batch => {
            const report = batch.qualityReport;
            return {
                batchId: batch.batchId || batch._id.toString().slice(-6),
                woolType: batch.woolType,
                date: report.inspectionDate || report.createdAt,
                grade: report.grade || report.decision,
                qualityScore: report.qualityScore,
                notes: report.notes,
                _id: report._id,
            };
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const approveBatch = async (req, res) => {
    try {
        const batch = await WoolBatch.findById(req.params.id);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });
        if (batch.currentStage !== 'Finished') {
            return res.status(400).json({ message: 'Only Finished batches can be approved' });
        }
        batch.qualityStatus = 'Approved';
        await batch.save();
        res.json({ message: 'Batch approved', batch });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const rejectBatch = async (req, res) => {
    try {
        const batch = await WoolBatch.findById(req.params.id);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });
        if (batch.currentStage !== 'Finished') {
            return res.status(400).json({ message: 'Only Finished batches can be rejected' });
        }
        batch.qualityStatus = 'Rejected';
        await batch.save();
        res.json({ message: 'Batch rejected', batch });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Single aggregation pipeline — replaces 4 separate DB queries
const getAnalytics = async (req, res) => {
    try {
        const [stats] = await QualityReport.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    approved: { $sum: { $cond: [{ $eq: ['$decision', 'Approved'] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ['$decision', 'Rejected'] }, 1, 0] } },
                    avgDiameter: { $avg: '$fiberDiameter' },
                    avgYield: { $avg: '$cleanWoolYield' },
                    avgScore: { $avg: '$qualityScore' },
                }
            }
        ]);

        if (!stats) return res.json({ totalInspections: 0, approvedCount: 0, rejectedCount: 0, passRate: 0, avgDiameter: 0, avgYield: 0, avgScore: 0 });

        res.json({
            totalInspections: stats.total,
            approvedCount: stats.approved,
            rejectedCount: stats.rejected,
            passRate: ((stats.approved / stats.total) * 100).toFixed(1),
            avgDiameter: stats.avgDiameter ? stats.avgDiameter.toFixed(2) : 0,
            avgYield: stats.avgYield ? stats.avgYield.toFixed(1) : 0,
            avgScore: stats.avgScore ? stats.avgScore.toFixed(1) : 0,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getQualityLogs = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 50);
        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            QualityReport.find()
                .populate('batch', 'batchId woolType')
                .populate('inspector', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            QualityReport.countDocuments(),
        ]);

        res.json({ logs, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createInspection, approveBatch, rejectBatch, getMyQualityReports, getAnalytics, getQualityLogs };
