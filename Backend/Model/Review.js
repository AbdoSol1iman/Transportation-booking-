const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    required: false,
  },
}, {
  timestamps: true,
});

reviewSchema.index({ userId: 1, tripId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
