const Vehicle = require('../Model/Vehicle');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const createVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Vehicle created successfully',
    data: vehicle,
  });
});

const getAllVehicles = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [vehicles, total] = await Promise.all([
    Vehicle.find().skip(skip).limit(limit).lean(),
    Vehicle.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    count: vehicles.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: vehicles,
  });
});

const getVehicleById = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id).lean();
  if (!vehicle) {
    return next(new AppError('Vehicle not found', 404));
  }

  res.status(200).json({
    success: true,
    data: vehicle,
  });
});

const updateVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!vehicle) {
    return next(new AppError('Vehicle not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Vehicle updated successfully',
    data: vehicle,
  });
});

const deleteVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
  if (!vehicle) {
    return next(new AppError('Vehicle not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Vehicle deleted successfully',
  });
});

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
