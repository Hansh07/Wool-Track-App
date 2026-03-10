const express = require('express');
const router = express.Router();
const { assignRole, getUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/roleCheck');

router.patch('/assign-role/:userId', protect, checkPermission('manage_users'), assignRole);
router.get('/users', protect, checkPermission('manage_users'), getUsers);

module.exports = router;
