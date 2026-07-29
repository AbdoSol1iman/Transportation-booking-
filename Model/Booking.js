const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  bookingCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tripId: {
    type: Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  passengers: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'wallet'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
}, {
  timestamps: { createdAt: 'bookedAt', updatedAt: false },
});

module.exports = mongoose.model('Booking', bookingSchema);
