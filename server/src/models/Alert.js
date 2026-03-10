const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['System', 'Sensor', 'Inventory', 'Security'],
        required: true
    },
    severity: {
        type: String,
        enum: ['Info', 'Warning', 'Critical'],
        default: 'Info'
    },
    message: {
        type: String,
        required: true
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);
