const sql = require("../utils/postgres");

exports.postReservation = async (newReservation) => {
  const reservation = await sql`
    INSERT INTO reservations ${sql(
      newReservation,
      "user_id",
      "book_id",
      "start_date",
      "end_date",
      "extend_count",
      "status"
    )}
    RETURNING *;
  `;
  return reservation[0];
};

exports.extendReservation = async (userId, bookId, newEndDate) => {
  const existing = await sql`
    SELECT * FROM reservations
    WHERE user_id = ${userId} AND book_id = ${bookId} AND status = 'active'
    LIMIT 1
  `;
  if (!existing[0]) throw new Error("No reservation found");
  if (existing[0].extend_count >= 2) throw new Error("Maximum extend reached");

  const updated = await sql`
    UPDATE reservations
    SET end_date = ${newEndDate}, extend_count = extend_count + 1
    WHERE id = ${existing[0].id}
    RETURNING *;
  `;
  return updated[0];
};

exports.getAllReservations = async () => {
  const reservationList = await sql`
    SELECT 
      r.*, 
      b.title, 
      b.author, 
      b.genre_id, 
      b.image, 
      u.email AS user_email,
      COALESCE(AVG(rv.rating)::numeric(10,1), 0) AS rating
    FROM reservations r
    JOIN books b ON r.book_id = b.id
    JOIN users u ON r.user_id = u.id
    LEFT JOIN reviews rv ON rv.book_id = b.id
    GROUP BY r.id, b.id, u.id
  `;
  return reservationList;
};

exports.getReservationsByUser = async (userId) => {
  const reservations = await sql`
    SELECT 
      r.*, 
      b.title, 
      b.author, 
      b.genre_id, 
      b.image, 
      g.genre,
      u.email AS user_email,
      COALESCE(AVG(rv.rating)::numeric(10,1), 0) AS rating
    FROM reservations r
    JOIN books b ON r.book_id = b.id
    JOIN genres g ON b.genre_id = g.id
    JOIN users u ON r.user_id = u.id
    LEFT JOIN reviews rv ON rv.book_id = b.id
    WHERE r.user_id = ${userId} AND r.status = 'active'
    GROUP BY r.id, b.id, g.id, u.id
    ORDER BY r.end_date ASC
  `;
  return reservations;
};

exports.getReservationByUserAndBook = async (userId, bookId) => {
  const reservations = await sql`
    SELECT 
      r.*, 
      b.title, 
      b.author, 
      b.genre_id, 
      b.image, 
      g.genre,
      u.email AS user_email,
      COALESCE(AVG(rv.rating)::numeric(10,1), 0) AS rating
    FROM reservations r
    JOIN books b ON r.book_id = b.id
    JOIN genres g ON b.genre_id = g.id
    JOIN users u ON r.user_id = u.id
    LEFT JOIN reviews rv ON rv.book_id = b.id
    WHERE r.user_id = ${userId} AND r.book_id = ${bookId} AND r.status = 'active'
    GROUP BY r.id, b.id, g.id, u.id
    LIMIT 1
  `;
  return reservations.length > 0 ? reservations[0] : null;
};
exports.returnReservation = async (bookId) => {
  const [existing] = await sql`
    SELECT * FROM reservations
    WHERE book_id = ${bookId} AND status = 'active'
    LIMIT 1
  `;

  if (!existing) {
    throw new Error("Active reservation not found for this book");
  }

  const [updated] = await sql`
    UPDATE reservations
    SET status = 'returned'
    WHERE id = ${existing.id}
    RETURNING *;
  `;

  return updated;
};

exports.searchReservations = async ({ title, email }) => {
  const reservations = await sql`
    SELECT 
      r.*, 
      b.title, 
      b.author, 
      b.genre_id, 
      b.image, 
      g.genre,
      u.email AS user_email,
      COALESCE(AVG(rv.rating)::numeric(10,1), 0) AS rating
    FROM reservations r
    JOIN books b ON r.book_id = b.id
    JOIN genres g ON b.genre_id = g.id
    JOIN users u ON r.user_id = u.id
    LEFT JOIN reviews rv ON rv.book_id = b.id
    WHERE 
      (${title ? sql`b.title ILIKE ${"%" + title + "%"}` : sql`TRUE`})
      AND (${email ? sql`u.email ILIKE ${"%" + email + "%"}` : sql`TRUE`})
    GROUP BY r.id, b.id, g.id, u.id
    ORDER BY r.end_date ASC
  `;
  return reservations;
};