const express = require('express');
const router = express.Router();
const {
  AddReview,
  getReview,
  getReviewById,
  updateReview,
  deleteReview,
} = require('../controllers/Reviews');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createReviewSchema } = require('../validations/schemas');

router.get('/', getReview);
router.get('/:id', getReviewById);

router.use(protect);

router.post('/', validate(createReviewSchema), AddReview);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;