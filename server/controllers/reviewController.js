const { addReview, getUserReviewForBook, updateReview} = require('../models/reviewModel');
const AppError = require("../utils/AppError");

exports.postReview = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const book_id = req.params.id;
    const user_id = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }

    const existingReview = await getUserReviewForBook(book_id, user_id);

    let review;
    if (existingReview) {
      review = await updateReview(existingReview.id, { rating });
    } else {
      review = await addReview({ book_id, user_id, rating });
    }

    res.status(201).json({
      status: "success",
      message: existingReview
        ? "Rating updated successfully."
        : "Rating added successfully.",
      data: review,
    });
  } catch (error) {
    next(error)
    res.status(500).json({ message: error.message });
  }
};

exports.getUserReview = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { bookId } = req.params;

    const review = await getUserReviewForBook(bookId, user_id);
    if (!review) {
      return res.status(404).json({ message: 'No rating found for this user.' });
    }

    res.status(200).json({
      message: 'User rating found.',
      data: review,
    });
  } catch (error) {
    next(error)
    res.status(500).json({ message: error.message });
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      throw new AppError("Please provide at least one field to update", 400);
    }

    const updatedReview = await updateReview(id, updates);

    if (!updatedCategory) {
      throw new AppError("Invalid id, genre not found and not updated", 404);
    }

    res.status(200).json({
      status: "success",
      data: updatedReview,
    });
  } catch (error) {
    next(error)
    res.status(500).json({ message: error.message });
  }
};

