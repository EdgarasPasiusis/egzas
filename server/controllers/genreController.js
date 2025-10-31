const {
  postGenre,
  deleteGenre,
  updateGenre,
  getAllGenres,
} = require("../models/genreModel");
const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

exports.postGenre = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newCategory = req.body;

    const postedCategory = await postGenre(newCategory);

    res.status(201).json({
      status: "success",
      data: postedCategory,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteGenre = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await deleteGenre(id);

    if (!category) {
      throw new AppError("genre not found", 404);
    }
    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateGenre = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      throw new AppError("Please provide at least one field to update", 400);
    }

    const updatedCategory = await updateGenre(id, updates);

    if (!updatedCategory) {
      throw new AppError("Invalid id, genre not found and not updated", 404);
    }

    res.status(200).json({
      status: "success",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllGenres = async (req, res, next) => {
  try {
    const categoryList = await getAllGenres();
    res.status(200).json({
      status: "success",
      tours: categoryList,
    });
  } catch (error) {
    next(error);
  }
};
