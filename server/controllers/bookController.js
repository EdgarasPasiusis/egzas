const {
  postBook,
  deleteBook,
  updateBook,
  getAllBooks,
  getBookByID,
  searchAndFilterBooks
} = require("../models/bookModel");
const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

exports.postBook = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newBook = req.body;

    const postedBook = await postBook(newBook);

    res.status(201).json({
      status: "success",
      data: postedBook,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await deleteBook(id);

    if (!book) {
      throw new AppError("book not found", 404);
    }
    res.status(200).json({
      status: "success",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      throw new AppError("Please provide at least one field to update", 400);
    }

    const updatedBook = await updateBook(id, updates);

    if (!updatedBook) {
      throw new AppError("Invalid id, book not found and not updated", 404);
    }

    res.status(200).json({
      status: "success",
      data: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBooks = async (req, res, next) => {
  try {
    const bookList = await getAllBooks();
    res.status(200).json({
      status: "success",
      tours: bookList,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await getBookByID(id);

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

exports.searchBook = async (req, res, next) => {
  try {
    const { title, author, genre_id, sortBy, order, page, limit } = req.query;

    const books = await searchAndFilterBooks({
      title,
      author,
      genre_id: genre_id ? parseInt(genre_id, 10) : undefined,
      sortBy,
      order,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    });

    res.status(200).json({
      status: "success",
      results: Array.isArray(books) ? books.length : 0,
      data: Array.isArray(books) ? books : [],
    });
  } catch (error) {
    console.error("Error in searchBooks:", error.message);
    next(error);
  }
};