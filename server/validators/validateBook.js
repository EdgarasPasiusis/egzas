const { body } = require("express-validator");

const validateBook = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 100 }).withMessage("Title must not exceed 100 characters"),
  
  body("author")
    .notEmpty().withMessage("Author is required")
    .isLength({ max: 50 }).withMessage("Author must not exceed 50 characters"),
  
  body("description")
    .optional()
    .isLength({ max: 1000 }).withMessage("Description must not exceed 1000 characters"),
  
  body("image")
    .optional()
    .isURL().withMessage("Image must be a valid URL"),
  
];

module.exports = { validateBook };
