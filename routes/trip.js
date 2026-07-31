const express = require('express');
const router = express.Router();
const {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/trip');
const { protect, restrictTo } = require('../middleware/auth');
const { ROLES } = require('../config/roles');
const validate = require('../middleware/validate');
const { createTripSchema } = require('../validations/schemas');

router.get('/', getAllTrips);
router.get('/:id', getTripById);

router.use(protect);

// Drivers, Dispatchers, and Admins can update trip status
router.patch('/:id', restrictTo(ROLES.ADMIN, ROLES.DISPATCHER, ROLES.DRIVER), updateTrip);

// Only Admins & Dispatchers can create or delete trips
router.post('/', restrictTo(ROLES.ADMIN, ROLES.DISPATCHER), validate(createTripSchema), createTrip);
router.delete('/:id', restrictTo(ROLES.ADMIN, ROLES.DISPATCHER), deleteTrip);

module.exports = router;
