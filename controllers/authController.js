const jwt = require('jsonwebtoken');
const User = require('../Model/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  const secret = process.env.JWT_SECRET || process.env.SECRET_KEY || 'default_jwt_secret_key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';
  return jwt.sign({ id }, secret, { expiresIn });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.passwordHash = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: user,
  });
};

const register = catchAsync(async (req, res, next) => {
  const { fullName, email, phone, password, role } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    return next(new AppError('Email or phone number is already registered', 400));
  }

  const newUser = await User.create({
    fullName,
    email,
    phone,
    passwordHash: password,
    role: role || 'passenger',
  });

  sendTokenResponse(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await user.correctPassword(password, user.passwordHash))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (user.status !== 'active') {
    return next(new AppError('Account is inactive or blocked', 403));
  }

  sendTokenResponse(user, 200, res);
});

const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+passwordHash');

  if (!(await user.correctPassword(currentPassword, user.passwordHash))) {
    return next(new AppError('Your current password is incorrect', 401));
  }

  user.passwordHash = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

module.exports = { register, login, getMe, updatePassword };
