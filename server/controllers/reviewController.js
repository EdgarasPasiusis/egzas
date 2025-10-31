const reviewModel = require("../models/reviewModel");
const AppError = require("../utils/AppError");

exports.postReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const book_id = req.params.id;
    const user_id = req.user.id;

    const newReview = await reviewModel.addReview({
      book_id,
      user_id,
      rating,
      comment,
    });
    res.status(201).json({ status: "success", data: newReview });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await reviewModel.deleteComment(id);

    if (!comment) {
      throw new AppError("comment not found", 404);
    }
    res.status(200).json({
      status: "success",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const book_id = req.params.id;
    const reviews = await reviewModel.getReviewsByBookId(book_id);
    res.status(200).json({ status: "success", data: reviews });
  } catch (error) {
    console.error("GetReviews error:", error);
    next(error);
  }
};

