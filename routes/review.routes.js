const express = require("express");
const router = express.Router();

const {
  AddReview,
  getReview,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/Reviews");

// Create
router.post("/", AddReview);

// Read All
router.get("/", getReview);

// Read One
router.get("/:id", getReviewById);

// Update
router.patch("/:id", updateReview);

//delete 
router.delete("/:id", deleteReview);
module.exports = router;