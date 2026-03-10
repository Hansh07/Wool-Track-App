const express = require('express');
const router = express.Router();
const { issueCertificate, getCertificateByNumber, getMyCertificates, revokeCertificate } = require('../controllers/certificateController');
const { protect, checkPermission } = require('../middleware/auth');

router.get('/my', protect, checkPermission('view_certificates'), getMyCertificates);
router.get('/verify/:number', getCertificateByNumber);
router.post('/', protect, checkPermission('issue_certificate'), issueCertificate);
router.patch('/:id/revoke', protect, checkPermission('manage_certificates'), revokeCertificate);

module.exports = router;
