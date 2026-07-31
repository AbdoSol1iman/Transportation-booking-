const express = require('express');
const router = express.Router();
const { register, login, getMe, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, updatePasswordSchema } = require('../validations/schemas');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.patch('/update-password', validate(updatePasswordSchema), updatePassword);

module.exports = router;
