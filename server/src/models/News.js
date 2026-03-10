const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    targetRoles: [{
        type: String // e.g., ["FARMER", "BUYER"]
    }],
    isPublished: {
        type: Boolean,
        default: true
    },
    publishDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('News', newsSchema);
