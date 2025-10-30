const sql = require("../utils/postgres");

exports.postBook = async (newBook) => {
  const book = await sql`
      INSERT INTO books ${sql(
        newBook,
        "genre_id",
        "title",
        "author",
        "description",
        "image"
      )}
         RETURNING *;
      `;
  return book[0];
};

exports.deleteBook = async (id) => {
  const book = await sql`
   DELETE FROM books
   WHERE books.id = ${id}
   returning *
    `;
  return book;
};

exports.updateBook = async (id, updatedBook) => {
  const filteredBook = {};
  ["genre_id", "title", "author", "description", "image"].forEach((key) => {
    if (updatedBook[key] !== undefined) {
      filteredBook[key] = updatedBook[key];
    }
  });

  if (Object.keys(filteredBook).length === 0) return null;

  const book = await sql`
    UPDATE books
    SET ${sql(filteredBook)}
    WHERE id = ${id}
    RETURNING *;
  `;

  return book[0];
};



exports.getAllBooks = async () => {
  const bookList = await sql`
    SELECT
      books.id,
      books.title,
      books.author,
      books.image,
      COALESCE(AVG(r.rating)::numeric(10,1), 0) AS rating,
      genres.genre
    FROM books
    JOIN genres ON books.genre_id = genres.id
    LEFT JOIN reviews r ON r.book_id = books.id
    GROUP BY books.id, books.title, books.author, books.image, genres.genre
    ORDER BY books.title
  `;
  return bookList;
};


exports.getBookByID = async (id) => {
  const [book] = await sql`
    SELECT 
      b.id,
      b.title,
      b.author,
      b.image,
      b.description,
      g.genre,
      COALESCE(AVG(r.rating)::numeric(10,1), 0) AS rating,
      NOT EXISTS (
        SELECT 1 FROM reservations res
        WHERE res.book_id = b.id AND res.status = 'active'
      ) AS is_available
    FROM books AS b
    JOIN genres AS g ON b.genre_id = g.id
    LEFT JOIN reviews r ON r.book_id = b.id
    WHERE b.id = ${id}
    GROUP BY b.id, b.title, b.author, b.image, b.description, g.genre
  `;
  return book;
};

exports.searchAndFilterBooks = async (params) => {
  const {
    title,
    author,
    genre_id,
    sortBy = "title",
    order = "asc",
    page = 1,
    limit = 10,
  } = params;

  const offset = (page - 1) * limit;

  const sortColumns = {
    title: sql`books.title`,
    author: sql`books.author`,
  };

  const safeSort = sortColumns[sortBy] || sql`books.title`;
  const safeOrder = order.toLowerCase() === "desc" ? sql`DESC` : sql`ASC`;
  const filters = [];

  if (title || author) {
    if (title && author) {
      filters.push(
        sql`(books.title ILIKE ${"%" + title + "%"} OR books.author ILIKE ${"%" + author + "%"})`
      );
    } else if (title) {
      filters.push(sql`books.title ILIKE ${"%" + title + "%"}`);
    } else if (author) {
      filters.push(sql`books.author ILIKE ${"%" + author + "%"}`);
    }
  }

  if (genre_id) {
    filters.push(sql`books.genre_id = ${genre_id}`);
  }

  let whereSQL = sql``;
  if (filters.length > 0) {
    let combined = filters[0];
    for (let i = 1; i < filters.length; i++) {
      combined = sql`${combined} AND ${filters[i]}`;
    }
    whereSQL = sql`WHERE ${combined}`;
  }

  const result = await sql`
SELECT 
  books.*,
  genres.genre AS genre
FROM books
JOIN genres ON books.genre_id = genres.id
${whereSQL}
ORDER BY ${safeSort} ${safeOrder}
LIMIT ${limit} OFFSET ${offset}
  `;

  return result || [];
};