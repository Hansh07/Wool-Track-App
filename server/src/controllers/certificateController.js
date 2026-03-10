const Certificate = require('../models/Certificate');
const QRCode = require('qrcode');
const logger = require('../utils/logger');

const issueCertificate = async (req, res) => {
    try {
        const { batchId, qualityReportId, issuedToId, type, grade, woolType, weight, fiberDiameter, cleanWoolYield, origin, validDays, metadata } = req.body;
        const validUntil = new Date(Date.now() + (validDays || 365) * 24 * 60 * 60 * 1000);
        const cert = await Certificate.create({ batch: batchId, qualityReport: qualityReportId, issuedBy: req.user._id, issuedTo: issuedToId, type, grade, woolType, weight, fiberDiameter, cleanWoolYield, origin, validUntil, metadata });
        const verifyUrl = (process.env.CLIENT_URL || 'http://localhost:5173') + '/verify-cert/' + cert.certificateNumber;
        cert.verificationUrl = verifyUrl;
        cert.blockchainHash = require('crypto').createHash('sha256').update(cert.certificateNumber + cert.batch.toString() + cert.createdAt.toISOString()).digest('hex');
        const qrCode = await QRCode.toDataURL(verifyUrl);
        cert.qrCode = qrCode;
        await cert.save();
        logger.info('Certificate issued: ' + cert.certificateNumber);
        res.status(201).json({ success: true, certificate: cert });
    } catch (error) {
        logger.error('Certificate issuance error: ' + error.message);
        res.status(500).json({ success: false, message: 'Certificate issuance failed' });
    }
};

const getCertificateByNumber = async (req, res) => {
    try {
        const cert = await Certificate.findOne({ certificateNumber: req.params.number }).populate('batch', 'batchId woolType weight').populate('issuedBy', 'name').populate('issuedTo', 'name');
        if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
        res.json({ success: true, certificate: cert });
    } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

const getMyCertificates = async (req, res) => {
    try {
        const certs = await Certificate.find({ issuedTo: req.user._id }).populate('batch', 'batchId woolType weight').populate('issuedBy', 'name').sort({ createdAt: -1 });
        res.json({ success: true, certificates: certs });
    } catch { res.status(500).json({ success: false, message: 'Failed to fetch certificates' }); }
};

const revokeCertificate = async (req, res) => {
    try {
        const { reason } = req.body;
        const cert = await Certificate.findById(req.params.id);
        if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
        cert.isRevoked = true;
        cert.revokedReason = reason || 'Revoked by admin';
        await cert.save();
        res.json({ success: true, message: 'Certificate revoked' });
    } catch { res.status(500).json({ success: false, message: 'Revocation failed' }); }
};

module.exports = { issueCertificate, getCertificateByNumber, getMyCertificates, revokeCertificate };
