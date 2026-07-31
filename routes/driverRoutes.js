const express = require('express');
const router = express.Router();
const {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} = require('../controllers/driverController');
const { protect, restrictTo } = require('../middleware/auth');
const { ROLES } = require('../config/roles');
const validate = require('../middleware/validate');
const { createDriverSchema } = require('../validations/schemas');

router.get('/', getAllDrivers);
router.get('/:id', getDriverById);

// Admin & Dispatcher protected routes
router.use(protect, restrictTo(ROLES.ADMIN, ROLES.DISPATCHER));

router.post('/', validate(createDriverSchema), createDriver);
router.patch('/:id', updateDriver);
router.delete('/:id', deleteDriver);

module.exports = router;
