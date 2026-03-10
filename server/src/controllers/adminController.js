const User = require('../models/User');
const permissionsConfig = require('../config/permissions.json');

// @desc    Assign role to user
// @route   PATCH /api/admin/assign-role/:userId
// @access  Private (ADMIN)
const assignRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!permissionsConfig[role]) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        // Permissions updated by pre-save hook in model
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
        });
    } catch (error) {
        console.error('assignRole error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (ADMIN)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password -twoFactorSecret').lean();
        res.json(users);
    } catch (error) {
        console.error('getUsers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { assignRole, getUsers };
