const WoolBatch = require('../models/WoolBatch');
const { calculateRevenue } = require('../utils/revenueCalculator');

/* ─── Workflow stages visible to each role ───────────────────────────────────
 *
 *   FARMER          → creates batch (RAW stage)
 *   MILL_OPERATOR   → sees all stages; moves batch through pipeline
 *   QUALITY_INSPECTOR → sees only Finished batches (ready to inspect)
 *   BUYER           → sees only Approved batches (marketplace)
 *   ADMIN           → sees everything
 */

const createBatch = async (req, res) => {
    // Only farmers (and admins) are allowed to create raw wool batches
    if (req.user.role !== 'FARMER' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Only farmers can create batches' });
    }

    try {
        const { woolType, weight, moisture, source } = req.body;
        const images = req.files ? req.files.map(file => '/uploads/' + file.filename) : [];

        const batch = new WoolBatch({
            creator: req.user._id,
            farmerId: req.user._id,          // creator is always the farmer
            woolType, weight, moisture, source, images,
            currentStage: 'RAW',
            processingLogs: [{
                stage: 'RAW',
                note: 'Batch registered by farmer',
                operator: req.user._id,
            }],
        });

        const created = await batch.save();
        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getBatches = async (req, res) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 20);
        const skip  = (page - 1) * limit;

        // ── Role-based query filters ──────────────────────────────────────────
        let query = {};

        switch (req.user.role) {
            case 'FARMER':
                // Farmers only see their own batches
                query = { $or: [{ creator: req.user._id }, { farmerId: req.user._id }] };
                break;

            case 'MILL_OPERATOR':
                // Mill operators see all batches in the processing pipeline
                // (everything — they need to pull RAW batches into the system)
                query = {};
                break;

            case 'QUALITY_INSPECTOR':
                // Inspectors only see batches that have completed mill processing
                query = { currentStage: 'Finished' };
                break;

            case 'BUYER':
                // Buyers only see quality-approved, unsold batches
                query = { qualityStatus: 'Approved', isSold: false };
                break;

            case 'ADMIN':
                query = {};
                break;

            default:
                query = {};
        }

        // Optional additional filters from query string
        if (req.query.status) query.qualityStatus = req.query.status;
        if (req.query.stage)  query.currentStage  = req.query.stage;

        const [batches, total] = await Promise.all([
            WoolBatch.find(query)
                .select('-processingLogs')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            WoolBatch.countDocuments(query),
        ]);

        res.json({ batches, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getBatchById = async (req, res) => {
    try {
        const batch = await WoolBatch.findById(req.params.id)
            .populate('creator', 'name email')
            .populate('qualityReport')
            .populate('processingLogs.operator', 'name');

        if (!batch) return res.status(404).json({ message: 'Batch not found' });

        // Buyers can only view approved batches
        if (req.user.role === 'BUYER' && batch.qualityStatus !== 'Approved') {
            return res.status(403).json({ message: 'Batch not available' });
        }

        res.json(batch);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateBatchStatus = async (req, res) => {
    // Only mill operators (and admins) can move batches through stages
    if (req.user.role !== 'MILL_OPERATOR' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Only mill operators can update batch stages' });
    }

    try {
        const { stage, note } = req.body;
        const VALID_STAGES = ['RAW', 'Cleaning', 'Carding', 'Spinning', 'Finished'];

        if (!VALID_STAGES.includes(stage)) {
            return res.status(400).json({ message: `Invalid stage. Must be one of: ${VALID_STAGES.join(', ')}` });
        }

        const batch = await WoolBatch.findById(req.params.id).populate('qualityReport');
        if (!batch) return res.status(404).json({ message: 'Batch not found' });

        batch.currentStage = stage;
        batch.processingLogs.push({ stage, note: note || `Moved to ${stage}`, operator: req.user._id });

        if (stage === 'Finished' && batch.qualityReport) {
            batch.financials = calculateRevenue(batch);
        }

        const updated = await batch.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addLog = async (req, res) => {
    try {
        const { note } = req.body;
        const batch = await WoolBatch.findById(req.params.id);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });

        batch.processingLogs.push({
            stage: batch.currentStage,
            note,
            operator: req.user._id,
        });

        await batch.save();
        res.json(batch);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteBatch = async (req, res) => {
    try {
        const batch = await WoolBatch.findById(req.params.id);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });

        const isOwner = batch.creator.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to delete this batch' });
        }
        if (batch.isSold) {
            return res.status(400).json({ message: 'Cannot delete a sold batch' });
        }

        await batch.deleteOne();
        res.json({ message: 'Batch removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createBatch, getBatches, getBatchById, updateBatchStatus, addLog, deleteBatch };
