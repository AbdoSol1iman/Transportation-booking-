const crypto = require('crypto');
const mongoose = require('mongoose');
const Booking = require('../Model/Booking');
const Trip = require('../Model/Trip');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const createBooking = catchAsync(async (req, res, next) => {
  const { tripId, passengers, paymentMethod } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    return next(new AppError('Invalid Trip ID format', 400));
  }

  if (!Number.isInteger(passengers) || passengers <= 0) {
    return next(new AppError('Passengers count must be a positive integer greater than zero', 400));
  }

  const allowedPaymentMethods = ['cash', 'card', 'wallet'];
  if (!paymentMethod || !allowedPaymentMethods.includes(paymentMethod)) {
    return next(new AppError(`Invalid payment method. Allowed: ${allowedPaymentMethods.join(', ')}`, 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedTrip = await Trip.findOneAndUpdate(
      {
        _id: tripId,
        status: 'scheduled',
        departureTime: { $gt: new Date() },
        $expr: { $lte: [{ $add: ['$currentPassengers', passengers] }, '$capacity'] },
      },
      { $inc: { currentPassengers: passengers } },
      { new: true, session }
    );

    if (!updatedTrip) {
      const checkTrip = await Trip.findById(tripId).session(session);
      if (!checkTrip) {
        throw new AppError('Trip not found', 404);
      }
      if (checkTrip.status === 'fullyBooked') {
        throw new AppError('عذراً، هذه الرحلة مكتملة المقاعد ولا يمكن الحجز عليها', 400);
      }
      if (checkTrip.status !== 'scheduled') {
        throw new AppError(`Cannot book seats for a trip with status: ${checkTrip.status}`, 400);
      }
      if (checkTrip.departureTime <= new Date()) {
        throw new AppError('عذراً، لا يمكن الحجز على رحلة انتهى ميعاد مغادرتها', 400);
      }
      const availableSeats = Math.max(0, checkTrip.capacity - checkTrip.currentPassengers);
      throw new AppError(`لا توجد مقاعد كافية. المطلوب: ${passengers}، المتاح: ${availableSeats}`, 400);
    }

    // ── Auto-close trip if now fully booked ──────────────────────────────────
    if (updatedTrip.currentPassengers >= updatedTrip.capacity) {
      await Trip.findByIdAndUpdate(
        tripId,
        { $set: { status: 'fullyBooked' } },
        { session }
      );
    }

    const bookingCode = `BK-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
    const totalPrice = updatedTrip.price * passengers;

    const [booking] = await Booking.create(
      [
        {
          bookingCode,
          userId,
          tripId,
          passengers,
          totalPrice,
          paymentMethod,
          paymentStatus: 'pending',
          status: 'confirmed',
        },
      ],
      { session }
    );

    await session.commitTransaction();

    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'tripId',
      populate: { path: 'routeId', populate: { path: 'startStationId endStationId' } },
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking,
    });
  } catch (error) {
    await session.abortTransaction();
    return next(error);
  } finally {
    session.endSession();
  }
});

const getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate({
      path: 'tripId',
      populate: [
        { path: 'routeId', populate: { path: 'startStationId endStationId' } },
        { path: 'vehicleId', select: 'plateNumber model vehicleType' },
        { path: 'driverId', select: 'fullName phone rating' },
      ],
    })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

const cancelBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid Booking ID format', 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(id).session(session);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to cancel this booking', 403);
    }

    if (booking.status === 'cancelled') {
      throw new AppError('Booking is already cancelled', 400);
    }

    const trip = await Trip.findById(booking.tripId).session(session);
    if (trip && trip.departureTime <= new Date()) {
      throw new AppError('Cannot cancel a booking after the trip has already departed', 400);
    }

    booking.status = 'cancelled';
    await booking.save({ session });

    if (trip) {
      await Trip.findByIdAndUpdate(
        booking.tripId,
        { $inc: { currentPassengers: -booking.passengers } },
        { session }
      );
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    await session.abortTransaction();
    return next(error);
  } finally {
    session.endSession();
  }
});

module.exports = { createBooking, getMyBookings, cancelBooking };
