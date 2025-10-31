const express = require("express");
const router = express.Router();

const {
  createReservation,
  getAllReservations,
  extendReservation,
  getReservationByUserAndBook,
  getMyReservations,
  returnReservation,
  searchReservations
} = require("../controllers/reservationController");
const { protect } = require("../controllers/authController");
const restrictToAdmin = require("../middleware/restrictToAdmin");

router.route("/search").get(protect, searchReservations);
router.route("/").post(protect, createReservation).get(getAllReservations);
router.route("/book/:bookId").get(protect, getReservationByUserAndBook);
router.route("/my").get(protect, getMyReservations);
router.route("/extend").put(protect, extendReservation);
router.route("/return").put(protect, restrictToAdmin, returnReservation); 

module.exports = router;
