const express = require('express');
const router = express.Router();
const {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
} = require('../controllers/stationController');
const { protect, restrictTo } = require('../middleware/auth');
const { ROLES } = require('../config/roles');
const validate = require('../middleware/validate');
const { createStationSchema } = require('../validations/schemas');

router.get('/', getAllStations);
router.get('/:id', getStationById);

// Admin & Dispatcher protected routes
router.use(protect, restrictTo(ROLES.ADMIN, ROLES.DISPATCHER));

router.post('/', validate(createStationSchema), createStation);
router.patch('/:id', updateStation);
router.delete('/:id', deleteStation);

module.exports = router;
