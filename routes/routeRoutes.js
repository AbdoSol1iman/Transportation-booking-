const express = require('express');
const router = express.Router();
const {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} = require('../controllers/routeController');
const { protect, restrictTo } = require('../middleware/auth');
const { ROLES } = require('../config/roles');
const validate = require('../middleware/validate');
const { createRouteSchema } = require('../validations/schemas');

router.get('/', getAllRoutes);
router.get('/:id', getRouteById);

// Admin & Dispatcher protected routes
router.use(protect, restrictTo(ROLES.ADMIN, ROLES.DISPATCHER));

router.post('/', validate(createRouteSchema), createRoute);
router.patch('/:id', updateRoute);
router.delete('/:id', deleteRoute);

module.exports = router;
