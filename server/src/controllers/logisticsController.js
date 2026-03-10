const Logistics = require('../models/Logistics');
const crypto = require('crypto');

const createShipment = async (req, res) => {
    try {
        const { orderId, batchId, carrier, origin, destination, estimatedDelivery, weight, vehicleNumber, driverName, driverPhone } = req.body;
        const trackingNumber = 'WM-TRK-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
        const shipment = await Logistics.create({ order: orderId, batch: batchId, trackingNumber, carrier, origin, destination, estimatedDelivery, weight, vehicleNumber, driverName, driverPhone, checkpoints: [{ location: origin, status: 'Picked Up', notes: 'Shipment created' }] });
        res.status(201).json({ success: true, shipment });
    } catch (error) { res.status(500).json({ success: false, message: 'Shipment creation failed' }); }
};

const getShipmentByTracking = async (req, res) => {
    try {
        const shipment = await Logistics.findOne({ trackingNumber: req.params.trackingNumber }).populate('order').populate('batch', 'batchId woolType weight');
        if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
        res.json({ success: true, shipment });
    } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

const updateShipment = async (req, res) => {
    try {
        const { status, currentLocation, notes, coordinates } = req.body;
        const shipment = await Logistics.findById(req.params.id);
        if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
        shipment.status = status || shipment.status;
        shipment.currentLocation = currentLocation || shipment.currentLocation;
        if (status) shipment.checkpoints.push({ location: currentLocation || shipment.currentLocation, status, notes, coordinates });
        if (status === 'Delivered') shipment.actualDelivery = new Date();
        await shipment.save();
        // Emit real-time update
        const io = req.app.get('io');
        if (io) io.emit('logistics_update', { shipmentId: shipment._id, status, currentLocation });
        res.json({ success: true, shipment });
    } catch { res.status(500).json({ success: false, message: 'Update failed' }); }
};

const getAllShipments = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        const shipments = await Logistics.find(query).populate('order').populate('batch', 'batchId woolType').sort({ createdAt: -1 });
        res.json({ success: true, shipments });
    } catch { res.status(500).json({ success: false, message: 'Failed to fetch shipments' }); }
};

module.exports = { createShipment, getShipmentByTracking, updateShipment, getAllShipments };
