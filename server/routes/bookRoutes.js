const express = require("express");
const router = express.Router();

const {
  postBook,
  deleteBook,
  updateBook,
  getAllBooks,
  getBookByID,
  searchBook,
} = require("../controllers/bookController");
const restrictToAdmin = require("../middleware/restrictToAdmin");
const { protect } = require("../controllers/authController");

router.route("/").post(postBook).get(getAllBooks);
router.route("/search").get(searchBook);
router
  .route("/:id")
  .delete(protect, restrictToAdmin, deleteBook)
  .put(protect, restrictToAdmin, updateBook)
  .get(getBookByID);

module.exports = router;
