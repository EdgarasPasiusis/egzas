const sql = require('../utils/postgres');

exports.addReview = async (reviewData) => {
  const { book_id, user_id, rating } = reviewData;
  const review = await sql`
    INSERT INTO reviews (book_id, user_id, rating)
    VALUES (${book_id}, ${user_id}, ${rating})
    RETURNING *;
  `;
  return review[0];
};

exports.getUserReviewForBook = async (book_id, user_id) => {
  const review = await sql`
    SELECT * FROM reviews
    WHERE book_id = ${book_id} AND user_id = ${user_id}
    LIMIT 1;
  `;
  return review[0] || null;
};

exports.updateReview = async (id, updatedReview) => {
  const review = await sql`
    update reviews set ${sql(
      updatedReview,
      "rating"
    )}
    where id = ${id}
    returning *;
  `;
  return review[0];
};