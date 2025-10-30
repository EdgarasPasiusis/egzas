const { body } = require("express-validator");
const { getUserByEmail } = require("../models/authModel");

const validateSignup = [

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .isLength({ max: 50 }).withMessage("Email must not exceed 50 characters")
    .normalizeEmail()
    .custom(async (value) => {
      const user = await getUserByEmail(value);
      if (user) throw new Error("Email already exists");
      return true;
    }),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/\d/).withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character")
    .custom((value, { req }) => {
      if (value !== req.body.passwordconfirm) {
        throw new Error("Password and confirmation do not match");
      }
      return true;
    }),

  body("passwordconfirm")
    .notEmpty().withMessage("Password confirmation is required"),
];

module.exports = { validateSignup };
