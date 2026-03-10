const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Temperature', 'Humidity', 'Power', 'Vibration', 'Other'],
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient time-series querying
sensorReadingSchema.index({ timestamp: -1, deviceId: 1 });

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
