const {
  postReservation,
  getAllReservations,
  extendReservation,
  getReservationByUserAndBook,
  getReservationsByUser,
  searchReservations,
  returnReservation,
} = require("../models/reservationModel");
const { validationResult } = require("express-validator");

exports.createReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, startDate, endDate } = req.body;

    const reservation = await postReservation({
      user_id: userId,
      book_id: bookId,
      start_date: startDate,
      end_date: endDate,
      extend_count: 0,
      status: "active",
    });

    res.status(201).json({ status: "success", data: reservation });
  } catch (error) {
    next(error);
    res.status(500).json({ message: error.message });
  }
};

exports.extendReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, newEndDate } = req.body;

    const updated = await extendReservation(userId, bookId, newEndDate);

    res.status(200).json({ status: "success", data: updated });
  } catch (error) {
    next(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getAllReservations = async (req, res, next) => {
  try {
    const reservationList = await getAllReservations();
    res.status(200).json({
      status: "success",
      tours: reservationList,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReservationByUserAndBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    const reservation = await getReservationByUserAndBook(userId, bookId);

    res.status(200).json({
      status: "success",
      data: reservation,
    });
  } catch (error) {
    next(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await getReservationsByUser(userId);

    res.status(200).json({
      status: "success",
      data: reservations,
    });
  } catch (error) {
    next(error);
    res.status(500).json({ message: error.message });
  }
};

exports.returnReservation = async (req, res) => {
  try {
    const { bookId } = req.body;
    if (!bookId) {
      return res.status(400).json({ message: "bookId is required" });
    }

    const updated = await returnReservation(bookId);

    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (error) {
    next(error);
    res.status(500).json({ message: error.message });
  }
};

exports.searchReservations = async (req, res) => {
  try {
    const { title, email } = req.query;
    const reservations = await searchReservations({ title, email });

    res.status(200).json({
      status: "success",
      data: reservations,
    });
  } catch (error) {
    next(error);
    res.status(500).json({ message: error.message });
  }
};
