const express = require('express');
const router = express.Router();
const { getSensorData } = require('../controllers/monitoringController');
const { protect, checkPermission } = require('../middleware/auth');

router.get('/sensors', protect, checkPermission('access_monitoring_dashboard'), getSensorData);

module.exports = router;
