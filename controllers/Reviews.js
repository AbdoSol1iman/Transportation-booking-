const Review = require('../Model/Review');
const Trip = require('../Model/Trip');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const AddReview = catchAsync(async (req, res, next) => {
  const { tripId, rating, comment } = req.body;
  const userId = req.user._id;

  const trip = await Trip.findById(tripId);
  if (!trip) {
    return next(new AppError('Trip not found', 404));
  }

  const existingReview = await Review.findOne({ userId, tripId });
  if (existingReview) {
    return next(new AppError('You have already submitted a review for this trip', 400));
  }

  const review = await Review.create({
    userId,
    tripId,
    rating,
    comment,
  });

  const populatedReview = await Review.findById(review._id)
    .populate('userId', 'fullName avatarUrl')
    .populate('tripId', 'departureTime arrivalTime');

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: populatedReview,
  });
});

const getReview = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.tripId) filter.tripId = req.query.tripId;

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('userId', 'fullName avatarUrl')
      .populate('tripId', 'departureTime')
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: reviews,
  });
});

const getReviewById = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate('userId', 'fullName avatarUrl')
    .populate('tripId')
    .lean();

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this review', 403));
  }

  if (req.body.rating) review.rating = req.body.rating;
  if (req.body.comment !== undefined) review.comment = req.body.comment;

  await review.save();

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: review,
  });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this review', 403));
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

module.exports = {
  AddReview,
  getReview,
  getReviewById,
  updateReview,
  deleteReview,
};