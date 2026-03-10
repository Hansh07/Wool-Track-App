const express = require('express');
const router = express.Router();
const { addToInventory, getInventory, updateInventoryStatus } = require('../controllers/inventoryController');
const { protect, checkPermission } = require('../middleware/auth');

router.get('/', protect, checkPermission('view_inventory'), getInventory);
router.post('/', protect, checkPermission('manage_inventory'), addToInventory);
router.patch('/:id', protect, checkPermission('manage_inventory'), updateInventoryStatus);

module.exports = router;
