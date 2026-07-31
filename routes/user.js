const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateUserStatus,
  deleteUser,
} = require('../controllers/user');
const { protect, restrictTo } = require('../middleware/auth');
const { ROLES } = require('../config/roles');

router.use(protect);

router.patch('/profile', updateProfile);
router.get('/:id', getUserById);

// Admin-only management routes
router.use(restrictTo(ROLES.ADMIN));

router.get('/', getAllUsers);
router.patch('/:id/status', updateUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;
