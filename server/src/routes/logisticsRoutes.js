const express = require('express');
const router = express.Router();
const { createShipment, getShipmentByTracking, updateShipment, getAllShipments } = require('../controllers/logisticsController');
const { protect, checkPermission } = require('../middleware/auth');

router.get('/', protect, checkPermission('view_logistics'), getAllShipments);
router.get('/track/:trackingNumber', protect, getShipmentByTracking);
router.post('/', protect, checkPermission('update_logistics'), createShipment);
router.patch('/:id', protect, checkPermission('update_logistics'), updateShipment);

module.exports = router;
