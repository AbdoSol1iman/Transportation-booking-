const Route = require('../Model/Route');
const Station = require('../Model/Station');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const createRoute = catchAsync(async (req, res, next) => {
  const { startStationId, endStationId, distance, estimatedDuration, status } = req.body;

  if (startStationId === endStationId) {
    return next(new AppError('Start station and End station cannot be the same', 400));
  }

  const [startStation, endStation] = await Promise.all([
    Station.findById(startStationId),
    Station.findById(endStationId),
  ]);

  if (!startStation || !endStation) {
    return next(new AppError('One or both specified stations do not exist', 404));
  }

  const route = await Route.create({
    startStationId,
    endStationId,
    distance,
    estimatedDuration,
    status: status || 'active',
  });

  const populatedRoute = await Route.findById(route._id)
    .populate('startStationId', 'name city')
    .populate('endStationId', 'name city');

  res.status(201).json({
    success: true,
    message: 'Route created successfully',
    data: populatedRoute,
  });
});

const getAllRoutes = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [routes, total] = await Promise.all([
    Route.find()
      .populate('startStationId', 'name city location')
      .populate('endStationId', 'name city location')
      .skip(skip)
      .limit(limit)
      .lean(),
    Route.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    count: routes.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: routes,
  });
});

const getRouteById = catchAsync(async (req, res, next) => {
  const route = await Route.findById(req.params.id)
    .populate('startStationId', 'name city location')
    .populate('endStationId', 'name city location')
    .lean();

  if (!route) {
    return next(new AppError('Route not found', 404));
  }

  res.status(200).json({
    success: true,
    data: route,
  });
});

const updateRoute = catchAsync(async (req, res, next) => {
  const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('startStationId', 'name city')
    .populate('endStationId', 'name city');

  if (!route) {
    return next(new AppError('Route not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Route updated successfully',
    data: route,
  });
});

const deleteRoute = catchAsync(async (req, res, next) => {
  const route = await Route.findByIdAndDelete(req.params.id);
  if (!route) {
    return next(new AppError('Route not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Route deleted successfully',
  });
});

module.exports = {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
};
