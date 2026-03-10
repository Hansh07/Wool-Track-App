const express = require('express');
const router = express.Router();
const { createInspection, approveBatch, rejectBatch, getMyQualityReports, getAnalytics, getQualityLogs } = require('../controllers/qualityController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/roleCheck');

router.get('/my', protect, checkPermission('view_quality_results'), getMyQualityReports);
router.get('/analytics', protect, checkPermission('view_quality_analytics'), getAnalytics);
router.get('/logs', protect, checkPermission('view_quality_logs'), getQualityLogs);

router.post('/inspect', protect, checkPermission('create_quality_inspection'), createInspection);
router.patch('/approve/:id', protect, checkPermission('approve_batch'), approveBatch);
router.patch('/reject/:id', protect, checkPermission('reject_batch'), rejectBatch);

module.exports = router;
