const { body } = require("express-validator");
const { getAllGenres } = require("../models/genreModel");

const validateGenre = [
  body("genre")
    .notEmpty().withMessage("Genre name is required")
    .isLength({ max: 50 }).withMessage("Genre name must not exceed 50 characters")
    .custom(async (value) => {
      const genres = await getAllGenres();
      const exists = genres.some((g) => g.genre.toLowerCase() === value.toLowerCase());
      if (exists) {
        throw new Error("Genre already exists");
      }
      return true;
    }),
];

module.exports = { validateGenre };