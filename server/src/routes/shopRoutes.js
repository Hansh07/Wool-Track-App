const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createOrder, createRazorpayOrder, verifyPayment, markAsPaid, getMyOrders, deleteOrder } = require('../controllers/shopController');
const { protect, checkPermission } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/security');

router.get('/products', protect, checkPermission('view_products'), getProducts);
router.get('/products/:id', protect, checkPermission('view_products'), getProductById);
router.post('/order', protect, checkPermission('buy_wool'), createOrder);
router.get('/orders/my', protect, getMyOrders);
router.delete('/order/:id', protect, deleteOrder);
router.post('/order/:id/pay', protect, markAsPaid);
router.post('/order/:id/razorpay', protect, paymentLimiter, createRazorpayOrder);
router.post('/order/:id/verify', protect, verifyPayment);

module.exports = router;
