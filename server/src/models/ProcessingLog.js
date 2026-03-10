const mongoose = require('mongoose');

const processingLogSchema = new mongoose.Schema({
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WoolBatch',
        required: true
    },
    stage: {
        type: String,
        required: true
    },
    operator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProcessingLog', processingLogSchema);
