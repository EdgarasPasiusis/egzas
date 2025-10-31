const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  getUserByID,
} = require("../controllers/userController");
const restrictToAdmin = require("../middleware/restrictToAdmin");
const { protect } = require("../controllers/authController");

router.route("/search").get(protect, restrictToAdmin, searchUsers);
router
  .route("/")
  .get(protect, restrictToAdmin, getAllUsers)
  .post(protect, restrictToAdmin, createUser);
router
  .route("/:id")
  .put(protect, restrictToAdmin, updateUser)
  .delete(protect, restrictToAdmin, deleteUser)
  .get(protect, restrictToAdmin, getUserByID);

module.exports = router;
