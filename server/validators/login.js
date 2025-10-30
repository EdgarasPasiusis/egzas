const { body } = require("express-validator");
const { getUserByEmail } = require("../models/authModel");
const argon2 = require("argon2");

const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const user = await getUserByEmail(value);
      if (!user) {
        throw new Error("User or password is incorrect");
      }
      req.user = user;
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .custom(async (value, { req }) => {
      const user = req.user;
      if (user) {
        const match = await argon2.verify(user.password, value);
        if (!match) {
          throw new Error("User or password is incorrect");
        }
      }
      return true;
    }),
];

module.exports = { validateLogin }; 