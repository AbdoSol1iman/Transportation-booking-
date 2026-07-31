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
    index: true,
  },
  tripId: {
    type: Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    index: true,
  },
  passengers: {
    type: Number,
    required: true,
    min: [1, 'Passengers count must be at least 1'],
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price cannot be negative'],
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
    index: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
    index: true,
  },
}, {
  timestamps: true,
});

bookingSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
