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
const { validateBook } = require("../validators/validateBook");
const handleValidationErrors = require("../validators/validationResult");

router
  .route("/")
  .post(validateBook, handleValidationErrors, protect, restrictToAdmin, postBook)
  .get(getAllBooks);
router.route("/search").get(searchBook);
router
  .route("/:id")
  .delete(protect, restrictToAdmin, deleteBook)
  .put(validateBook, handleValidationErrors, protect, restrictToAdmin, updateBook)
  .get(getBookByID);

module.exports = router;
