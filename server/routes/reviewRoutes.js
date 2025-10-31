const express = require("express");
const router = express.Router();

const { protect } = require("../controllers/authController");
const {
  postReview,
  getUserReview,
  updateReview,
} = require("../controllers/reviewController");

router.route("/book/:id").post(protect, postReview).put(protect, updateReview);
router.route("/book/:bookId/user").get(protect, getUserReview);

module.exports = router;
