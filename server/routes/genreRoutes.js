const express = require("express");
const router = express.Router();

const {
  postGenre,
  deleteGenre,
  updateGenre,
  getAllGenres,
} = require("../controllers/genreController");
const restrictToAdmin = require("../middleware/restrictToAdmin");
const { protect } = require("../controllers/authController");
const { validateGenre } = require("../validators/genreValidation");
const handleValidationErrors = require("../validators/validationResult");

router
  .route("/")
  .post(
    validateGenre,
    handleValidationErrors,
    protect,
    restrictToAdmin,
    postGenre
  )
  .get(getAllGenres);
router
  .route("/:id")
  .delete(protect, restrictToAdmin, deleteGenre)
  .put(
    validateGenre,
    handleValidationErrors,
    protect,
    restrictToAdmin,
    updateGenre
  );

module.exports = router;
