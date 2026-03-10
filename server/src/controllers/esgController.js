const ESGReport = require('../models/ESGReport');

const submitESGReport = async (req, res) => {
    try {
        const { batchId, reportPeriod, environmental, social, governance } = req.body;
        // Calculate ESG score
        const envScore = Math.min(100, (
            (environmental.renewableEnergyPercent || 0) * 0.3 +
            (environmental.wasteRecycledPercent || 0) * 0.2 +
            (environmental.animalWelfareScore || 50) * 0.5
        ));
        const socScore = Math.min(100, (
            (social.womenEmployedPercent || 0) * 0.3 +
            (social.safetyIncidents === 0 ? 100 : Math.max(0, 100 - (social.safetyIncidents || 0) * 20)) * 0.4 +
            (social.fairTradeCertified ? 100 : 50) * 0.3
        ));
        const govScore = governance.complianceScore || 50;
        const overallScore = Math.round((envScore * 0.4 + socScore * 0.35 + govScore * 0.25));
        const rating = overallScore >= 90 ? 'A+' : overallScore >= 80 ? 'A' : overallScore >= 70 ? 'B+' : overallScore >= 60 ? 'B' : overallScore >= 50 ? 'C' : 'D';
        const report = await ESGReport.create({ farmer: req.user._id, batch: batchId, reportPeriod, environmental, social, governance, overallScore, rating, submittedBy: req.user._id });
        res.status(201).json({ success: true, report });
    } catch (error) { res.status(500).json({ success: false, message: 'ESG report submission failed' }); }
};

const getMyESGReports = async (req, res) => {
    try {
        const reports = await ESGReport.find({ farmer: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, reports });
    } catch { res.status(500).json({ success: false, message: 'Failed to fetch ESG reports' }); }
};

const getAllESGReports = async (req, res) => {
    try {
        const reports = await ESGReport.find().populate('farmer', 'name email').sort({ createdAt: -1 });
        const avgScore = reports.length ? reports.reduce((s, r) => s + r.overallScore, 0) / reports.length : 0;
        res.json({ success: true, reports, stats: { total: reports.length, avgScore: Math.round(avgScore), topRating: 'A+' } });
    } catch { res.status(500).json({ success: false, message: 'Failed to fetch ESG reports' }); }
};

const verifyESGReport = async (req, res) => {
    try {
        const report = await ESGReport.findByIdAndUpdate(req.params.id, { isVerified: true, verifiedBy: req.user._id }, { new: true });
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
        res.json({ success: true, report });
    } catch { res.status(500).json({ success: false, message: 'Verification failed' }); }
};

module.exports = { submitESGReport, getMyESGReports, getAllESGReports, verifyESGReport };
