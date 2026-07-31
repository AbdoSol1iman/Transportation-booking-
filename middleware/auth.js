const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../Model/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { ROLE_PERMISSIONS } = require('../config/roles');

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const secret = process.env.JWT_SECRET || process.env.SECRET_KEY || 'default_jwt_secret_key';
  const decoded = jwt.verify(token, secret);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  if (currentUser.status === 'blocked' || currentUser.status === 'inactive') {
    return next(
      new AppError('Your account is currently inactive or blocked.', 403)
    );
  }

  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Role '${req.user.role}' does not have permission to perform this action`, 403)
      );
    }
    next();
  };
};

const checkPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    const hasAccess = requiredPermissions.some((perm) => userPermissions.includes(perm));

    if (!hasAccess) {
      return next(
        new AppError('You do not have the required permissions to perform this operation', 403)
      );
    }
    next();
  };
};

const checkOwnershipOrAdmin = (Model, userIdField = 'userId') => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid ID format', 400));
    }

    if (['admin', 'dispatcher'].includes(req.user.role)) {
      return next();
    }

    const document = await Model.findById(id);
    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    const ownerId = document[userIdField] ? document[userIdField].toString() : null;
    if (!ownerId || ownerId !== req.user._id.toString()) {
      return next(new AppError('You do not have permission to modify this resource', 403));
    }

    req.document = document;
    next();
  });
};

module.exports = {
  protect,
  restrictTo,
  checkPermission,
  checkOwnershipOrAdmin,
};
