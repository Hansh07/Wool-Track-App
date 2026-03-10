const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'WoolBatch', required: true },
    warehouse: { type: String, required: true },
    location: { type: String },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    woolType: { type: String, required: true },
    grade: { type: String },
    status: {
        type: String,
        enum: ['In Stock', 'Reserved', 'Processing', 'Shipped', 'Sold', 'Damaged'],
        default: 'In Stock',
    },
    receivedDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    temperatureRange: { type: String },
    humidityRange: { type: String },
    storageConditions: { type: String },
    barcodeId: { type: String, unique: true },
    notes: { type: String },
}, { timestamps: true });

inventorySchema.index({ warehouse: 1, status: 1 });
inventorySchema.index({ woolType: 1 });
inventorySchema.index({ batch: 1 });

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
