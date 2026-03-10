const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const WoolBatch = require('../models/WoolBatch');
const logger = require('../utils/logger');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getProducts = async (req, res) => {
    try {
        const { grade, woolType, minWeight, maxWeight, page = 1, limit = 20 } = req.query;
        const query = { qualityStatus: 'Approved', isSold: { $ne: true } };
        if (woolType) query.woolType = woolType;
        if (minWeight || maxWeight) {
            query.weight = {};
            if (minWeight) query.weight.$gte = Number(minWeight);
            if (maxWeight) query.weight.$lte = Number(maxWeight);
        }
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            WoolBatch.find(query).populate('qualityReport').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            WoolBatch.countDocuments(query),
        ]);
        res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (error) { res.status(500).json({ success: false, message: 'Failed to fetch products' }); }
};

const getProductById = async (req, res) => {
    try {
        const product = await WoolBatch.findById(req.params.id).populate('qualityReport');
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

const createOrder = async (req, res) => {
    try {
        const { batchIds } = req.body;
        if (!batchIds || batchIds.length === 0) return res.status(400).json({ success: false, message: 'No items in order' });

        // Single query to fetch all batches at once instead of N queries
        const batches = await WoolBatch.find({ _id: { $in: batchIds } });

        if (batches.length !== batchIds.length) {
            return res.status(404).json({ success: false, message: 'One or more batches not found' });
        }
        const soldBatch = batches.find(b => b.isSold);
        if (soldBatch) {
            return res.status(400).json({ success: false, message: 'Batch ' + soldBatch.batchId + ' is already sold' });
        }

        const totalAmount = batches.reduce((sum, b) => sum + (b.weight || 0) * 15, 0);
        const order = await Order.create({ buyer: req.user._id, items: batchIds, totalAmount, status: 'Pending' });

        // Single bulk update instead of N individual saves
        await WoolBatch.updateMany({ _id: { $in: batchIds } }, { $set: { isSold: true } });

        res.status(201).json({ success: true, order });
    } catch (error) { res.status(500).json({ success: false, message: 'Order creation failed' }); }
};

// Create Razorpay order for payment
const createRazorpayOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.buyer.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
        if (order.paymentStatus === 'Paid') return res.status(400).json({ success: false, message: 'Order already paid' });

        // Amount in paise (INR * 100)
        const amountInPaise = Math.round(order.totalAmount * 100);
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: order._id.toString(),
            notes: { orderId: order._id.toString(), buyerId: req.user._id.toString() },
        });

        res.json({
            success: true,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        logger.error('Razorpay order creation error: ' + error.message);
        res.status(500).json({ success: false, message: 'Payment initialization failed' });
    }
};

// Verify Razorpay payment signature
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed - invalid signature' });
        }

        order.paymentStatus = 'Paid';
        order.paymentMethod = 'Razorpay';
        order.transactionId = razorpay_payment_id;
        order.razorpayOrderId = razorpay_order_id;
        order.status = 'Completed';
        order.paidAt = new Date();
        await order.save();

        logger.info('Payment verified for order: ' + order._id);
        res.json({ success: true, message: 'Payment verified', order });
    } catch (error) {
        logger.error('Payment verification error: ' + error.message);
        res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
};

// Mark order as paid (UPI / Net Banking / Cash on Delivery)
const markAsPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.buyer.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
        if (order.paymentStatus === 'Paid') return res.status(400).json({ success: false, message: 'Order already paid' });

        const { paymentMethod, provider } = req.body;
        order.paymentStatus = 'Paid';
        order.paymentMethod = paymentMethod || 'UPI';
        order.transactionId = 'TXN-' + Date.now();
        order.status = 'Completed';
        order.paidAt = new Date();
        if (provider) order.paymentProvider = provider;
        await order.save();

        logger.info('Order marked as paid: ' + order._id);
        res.json({ success: true, message: 'Payment recorded', order });
    } catch (error) {
        logger.error('markAsPaid error: ' + error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id }).populate({ path: 'items', populate: { path: 'qualityReport' } }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch { res.status(500).json({ success: false, message: 'Failed to fetch orders' }); }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.buyer.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
        if (order.status !== 'Pending') return res.status(400).json({ success: false, message: 'Cannot cancel processed order' });
        for (const itemId of order.items) { await WoolBatch.findByIdAndUpdate(itemId, { isSold: false }); }
        await order.deleteOne();
        res.json({ success: true, message: 'Order cancelled' });
    } catch { res.status(500).json({ success: false, message: 'Server error' }); }
};

module.exports = { getProducts, getProductById, createOrder, createRazorpayOrder, verifyPayment, markAsPaid, getMyOrders, deleteOrder };
