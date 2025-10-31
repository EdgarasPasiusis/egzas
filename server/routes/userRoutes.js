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
const handleValidationErrors = require("../validators/validationResult");
const { validateSignup } = require("../validators/signup");

router.route("/search").get(protect, restrictToAdmin, searchUsers);
router
  .route("/")
  .get(protect, restrictToAdmin, getAllUsers)
  .post(
    validateSignup,
    handleValidationErrors,
    protect,
    restrictToAdmin,
    createUser
  );
router
  .route("/:id")
  .put(
    validateSignup,
    handleValidationErrors,
    protect,
    restrictToAdmin,
    updateUser
  )
  .delete(protect, restrictToAdmin, deleteUser)
  .get(protect, restrictToAdmin, getUserByID);

module.exports = router;
