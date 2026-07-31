const Station = require('../Model/Station');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const createStation = catchAsync(async (req, res, next) => {
  const { name, city, address, latitude, longitude, status } = req.body;

  const station = await Station.create({
    name,
    city,
    address,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    status: status || 'active',
  });

  res.status(201).json({
    success: true,
    message: 'Station created successfully',
    data: station,
  });
});

const getAllStations = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.city) filter.city = new RegExp(req.query.city, 'i');
  if (req.query.status) filter.status = req.query.status;

  const [stations, total] = await Promise.all([
    Station.find(filter).skip(skip).limit(limit).lean(),
    Station.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: stations.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: stations,
  });
});

const getStationById = catchAsync(async (req, res, next) => {
  const station = await Station.findById(req.params.id).lean();
  if (!station) {
    return next(new AppError('Station not found', 404));
  }

  res.status(200).json({
    success: true,
    data: station,
  });
});

const updateStation = catchAsync(async (req, res, next) => {
  const { latitude, longitude, ...rest } = req.body;
  const updateData = { ...rest };

  if (latitude !== undefined && longitude !== undefined) {
    updateData.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
  }

  const station = await Station.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!station) {
    return next(new AppError('Station not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Station updated successfully',
    data: station,
  });
});

const deleteStation = catchAsync(async (req, res, next) => {
  const station = await Station.findByIdAndDelete(req.params.id);
  if (!station) {
    return next(new AppError('Station not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Station deleted successfully',
  });
});

module.exports = {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
};
