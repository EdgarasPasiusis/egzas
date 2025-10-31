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

router.route("/").post(protect, restrictToAdmin, postGenre).get(getAllGenres);
router.route("/:id").delete(protect, restrictToAdmin, deleteGenre).put(protect, restrictToAdmin, updateGenre);

module.exports = router;
