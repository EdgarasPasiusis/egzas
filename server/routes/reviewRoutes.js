const express = require("express");
const router = express.Router();

const { protect } = require("../controllers/authController");
const { deleteComment, postReview, getReviews } = require("../controllers/reviewController");
const restrictToAdmin = require("../middleware/restrictToAdmin");

router.route("/book/:id").get(getReviews).post(protect, postReview);
router.route("/:id").delete(protect, restrictToAdmin, deleteComment);

module.exports = router;
