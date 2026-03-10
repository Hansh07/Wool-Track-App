const mongoose = require('mongoose');

const checkpointSchema = new mongoose.Schema({
    location: { type: String, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number },
    },
});

const logisticsSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'WoolBatch' },
    trackingNumber: { type: String, unique: true, required: true },
    carrier: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    currentLocation: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed', 'Returned'],
        default: 'Pending',
    },
    estimatedDelivery: { type: Date },
    actualDelivery: { type: Date },
    checkpoints: [checkpointSchema],
    weight: { type: Number },
    vehicleNumber: { type: String },
    driverName: { type: String },
    driverPhone: { type: String },
    specialInstructions: { type: String },
}, { timestamps: true });

// trackingNumber index is already created by unique:true on the field definition
logisticsSchema.index({ order: 1 });
logisticsSchema.index({ status: 1 });

const Logistics = mongoose.model('Logistics', logisticsSchema);
module.exports = Logistics;
