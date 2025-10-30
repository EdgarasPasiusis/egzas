const express = require("express");
const router = express.Router();

const {
  signup,
  logout,
  login,
  getAuthenticatedUser,
  protect,
} = require("../controllers/authController");
const { validateSignup } = require("../validators/signup");
const { validateLogin } = require("../validators/login");
const handleValidationErrors = require("../validators/validationResult");

router.route("/signup").post(validateSignup, handleValidationErrors, signup);
router.route("/logout").get(logout);
router.route("/login").post(validateLogin, handleValidationErrors, login);
router.route("/me").get(protect, getAuthenticatedUser);

module.exports = router;
