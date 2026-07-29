const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false },
});

module.exports = mongoose.model('Review', reviewSchema);
