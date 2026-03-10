const express = require('express');
const router = express.Router();
const { createAuction, getAuctions, getAuctionById, placeBid, endAuction } = require('../controllers/auctionController');
const { protect, checkPermission } = require('../middleware/auth');

router.get('/', protect, checkPermission('view_auction'), getAuctions);
router.get('/:id', protect, checkPermission('view_auction'), getAuctionById);
router.post('/', protect, checkPermission('create_auction'), createAuction);
router.post('/:id/bid', protect, checkPermission('place_bid'), placeBid);
router.patch('/:id/end', protect, endAuction);

module.exports = router;
