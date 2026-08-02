const express = require('express');
const router = express.Router();
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehiclesController');
const { protect, restrictTo } = require('../middleware/auth');
const { ROLES } = require('../config/roles');
const validate = require('../middleware/validate');
const { createVehicleSchema } = require('../validations/schemas');

router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);

// Admin & Dispatcher protected routes
router.use(protect, restrictTo(ROLES.ADMIN, ROLES.DISPATCHER));

router.post('/', validate(createVehicleSchema), createVehicle);
router.patch('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
