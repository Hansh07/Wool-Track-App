const express = require('express');
const router = express.Router();
const { createBatch, getBatches, getBatchById, updateBatchStatus, addLog, deleteBatch } = require('../controllers/batchController');
const { protect } = require('../middleware/auth');
const { checkPermission, checkRole } = require('../middleware/roleCheck');

const upload = require('../middleware/upload');

router.route('/')
    .get(protect, getBatches)
    .post(protect, checkPermission('create_batch'), upload.array('images', 2), createBatch);

router.route('/:id')
    .get(protect, getBatchById) // Detailed view
    .delete(protect, deleteBatch);

router.route('/:id/status')
    .patch(protect, checkPermission('update_batch_stage'), updateBatchStatus);

router.route('/:id/logs')
    .post(protect, checkPermission('add_processing_logs'), addLog);

module.exports = router;
