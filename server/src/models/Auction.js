const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    placedAt: { type: Date, default: Date.now },
});

const auctionSchema = new mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'WoolBatch', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    startPrice: { type: Number, required: true },
    reservePrice: { type: Number },
    currentBid: { type: Number },
    currentBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bids: [bidSchema],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Upcoming', 'Live', 'Ended', 'Cancelled', 'Sold'],
        default: 'Upcoming',
    },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    finalPrice: { type: Number },
    minBidIncrement: { type: Number, default: 100 },
}, { timestamps: true });

auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ batch: 1 });
auctionSchema.index({ seller: 1 });

const Auction = mongoose.model('Auction', auctionSchema);
module.exports = Auction;
