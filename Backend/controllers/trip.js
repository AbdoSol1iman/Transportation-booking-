const Trip = require('../Model/Trip');
const Route = require('../Model/Route');
const Vehicle = require('../Model/Vehicle');
const Driver = require('../Model/Driver');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllTrips = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.routeId) filter.routeId = req.query.routeId;
  if (req.query.driverId) filter.driverId = req.query.driverId;

  const [trips, total] = await Promise.all([
    Trip.find(filter)
      .populate([
        {
          path: 'routeId',
          populate: [
            { path: 'startStationId', select: 'name city location' },
            { path: 'endStationId', select: 'name city location' },
          ],
        },
        { path: 'vehicleId', select: 'plateNumber model capacity vehicleType' },
        { path: 'driverId', select: 'fullName phone rating' },
      ])
      .skip(skip)
      .limit(limit)
      .lean(),
    Trip.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: trips.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: trips,
  });
});

exports.getTripById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const trip = await Trip.findById(id)
    .populate([
      {
        path: 'routeId',
        populate: [
          { path: 'startStationId', select: 'name city location' },
          { path: 'endStationId', select: 'name city location' },
        ],
      },
      { path: 'vehicleId', select: 'plateNumber model capacity vehicleType' },
      { path: 'driverId', select: 'fullName phone rating' },
    ])
    .lean();

  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  res.status(200).json({
    success: true,
    data: trip,
  });
});

exports.createTrip = catchAsync(async (req, res, next) => {
  const { routeId, vehicleId, driverId, departureTime, arrivalTime, price, capacity, imageUrl } = req.body;

  const [route, vehicle, driver] = await Promise.all([
    Route.findById(routeId),
    Vehicle.findById(vehicleId),
    Driver.findById(driverId),
  ]);

  if (!route || !vehicle || !driver) {
    return next(new AppError('Referenced Route, Vehicle, or Driver does not exist', 404));
  }

  const trip = await Trip.create({
    routeId,
    vehicleId,
    driverId,
    departureTime,
    arrivalTime,
    price,
    capacity: capacity || vehicle.capacity,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  });

  const populatedTrip = await Trip.findById(trip._id).populate([
    { path: 'routeId', populate: { path: 'startStationId endStationId' } },
    { path: 'vehicleId' },
    { path: 'driverId' },
  ]);

  res.status(201).json({
    success: true,
    message: 'Trip created successfully',
    data: populatedTrip,
  });
});

exports.updateTrip = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedTrip = await Trip.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate([
    { path: 'routeId', populate: { path: 'startStationId endStationId' } },
    { path: 'vehicleId' },
    { path: 'driverId' },
  ]);

  if (!updatedTrip) {
    return next(new AppError('Trip not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Trip updated successfully',
    data: updatedTrip,
  });
});

exports.deleteTrip = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedTrip = await Trip.findByIdAndDelete(id);
  if (!deletedTrip) {
    return next(new AppError('Trip not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Trip deleted successfully',
  });
});
