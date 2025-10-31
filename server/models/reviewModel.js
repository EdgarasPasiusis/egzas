const sql = require('../utils/postgres');

exports.deleteComment = async (id) => {
  const comment = await sql`
   DELETE FROM reviews
   WHERE reviews.id = ${id}
   returning *
    `;
  return comment;
};

exports.addReview = async (reviewData) => {
  const { book_id, user_id, rating, comment } = reviewData;
  const review = await sql`
    INSERT INTO reviews (book_id, user_id, rating, comment)
    VALUES (${book_id}, ${user_id}, ${rating}, ${comment})
    RETURNING *;
  `;
  return review[0];
};

exports.getReviewsByBookId = async (book_id) => {
  const reviews = await sql`
    SELECT r.*, u.email
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.book_id = ${book_id}
    ORDER BY r.created_at DESC;
  `;
  return reviews;
};