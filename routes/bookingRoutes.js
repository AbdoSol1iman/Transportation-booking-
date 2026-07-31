const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/auth');
const { ROLES } = require('../config/roles');
const validate = require('../middleware/validate');
const { createBookingSchema } = require('../validations/schemas');

router.use(protect);

router.post('/', restrictTo(ROLES.PASSENGER, ROLES.ADMIN), validate(createBookingSchema), createBooking);
router.get('/my-bookings', getMyBookings);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
