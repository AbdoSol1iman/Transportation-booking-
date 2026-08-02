const mongoose = require('mongoose');
const User = require('../Model/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const getAllUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { fullName: new RegExp(req.query.search, 'i') },
      { email: new RegExp(req.query.search, 'i') },
      { phone: new RegExp(req.query.search, 'i') },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users,
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid User ID format', 400));
  }

  const user = await User.findById(id).lean();
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

const updateProfile = catchAsync(async (req, res, next) => {
  const { fullName, phone, avatarUrl } = req.body;

  const updateData = {};
  if (fullName) updateData.fullName = fullName;
  if (phone) updateData.phone = phone;
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});

const updateUserStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { role, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid User ID format', 400));
  }

  const updateData = {};
  if (role && ['passenger', 'driver', 'dispatcher', 'admin'].includes(role)) updateData.role = role;
  if (status && ['active', 'blocked', 'inactive'].includes(status)) updateData.status = status;

  if (Object.keys(updateData).length === 0) {
    return next(new AppError('Please provide a valid role or status to update', 400));
  }

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User status updated successfully',
    data: user,
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid User ID format', 400));
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  updateUserStatus,
  deleteUser,
};
