const express = require('express');
const router = express.Router();
const { submitESGReport, getMyESGReports, getAllESGReports, verifyESGReport } = require('../controllers/esgController');
const { protect, checkPermission } = require('../middleware/auth');

router.get('/my', protect, checkPermission('view_esg_reports'), getMyESGReports);
router.get('/', protect, checkPermission('view_esg_reports'), getAllESGReports);
router.post('/', protect, checkPermission('submit_esg_report'), submitESGReport);
router.patch('/:id/verify', protect, checkPermission('manage_esg'), verifyESGReport);

module.exports = router;
