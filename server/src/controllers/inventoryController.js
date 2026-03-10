const Inventory = require('../models/Inventory');
const crypto = require('crypto');

const addToInventory = async (req, res) => {
    try {
        const { batchId, warehouse, location, quantity, woolType, grade, storageConditions, expiryDate } = req.body;
        const barcodeId = 'WM-INV-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
        const item = await Inventory.create({ batch: batchId, warehouse, location, quantity, woolType, grade, barcodeId, storageConditions, expiryDate });
        res.status(201).json({ success: true, item });
    } catch (error) { res.status(500).json({ success: false, message: 'Failed to add inventory' }); }
};

const getInventory = async (req, res) => {
    try {
        const { warehouse, status, woolType } = req.query;
        const query = {};
        if (warehouse) query.warehouse = warehouse;
        if (status) query.status = status;
        if (woolType) query.woolType = woolType;
        const items = await Inventory.find(query).populate('batch', 'batchId woolType').sort({ createdAt: -1 });
        const summary = { total: items.reduce((s, i) => s + i.quantity, 0), byStatus: {}, byType: {} };
        items.forEach(i => {
            summary.byStatus[i.status] = (summary.byStatus[i.status] || 0) + i.quantity;
            summary.byType[i.woolType] = (summary.byType[i.woolType] || 0) + i.quantity;
        });
        res.json({ success: true, items, summary });
    } catch { res.status(500).json({ success: false, message: 'Failed to fetch inventory' }); }
};

const updateInventoryStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const item = await Inventory.findByIdAndUpdate(req.params.id, { status, notes }, { new: true });
        if (!item) return res.status(404).json({ success: false, message: 'Inventory item not found' });
        res.json({ success: true, item });
    } catch { res.status(500).json({ success: false, message: 'Update failed' }); }
};

module.exports = { addToInventory, getInventory, updateInventoryStatus };
