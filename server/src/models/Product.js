const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WoolBatch',
        required: true,
        unique: true
    },
    pricePerKg: {
        type: Number,
        required: true
    },
    listingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'Sold', 'Delisted'],
        default: 'Active'
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
