const Driver = require('../Model/Driver');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const createDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Driver created successfully',
    data: driver,
  });
});

const getAllDrivers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [drivers, total] = await Promise.all([
    Driver.find().skip(skip).limit(limit).lean(),
    Driver.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    count: drivers.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: drivers,
  });
});

const getDriverById = catchAsync(async (req, res, next) => {
  const driver = await Driver.findById(req.params.id).lean();
  if (!driver) {
    return next(new AppError('Driver not found', 404));
  }

  res.status(200).json({
    success: true,
    data: driver,
  });
});

const updateDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!driver) {
    return next(new AppError('Driver not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Driver updated successfully',
    data: driver,
  });
});

const deleteDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.findByIdAndDelete(req.params.id);
  if (!driver) {
    return next(new AppError('Driver not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Driver deleted successfully',
  });
});

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};
