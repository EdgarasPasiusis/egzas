const sql = require("../utils/postgres");

exports.postGenre = async (newGenre) => {
  const genre = await sql`
      INSERT INTO genres ${sql(
        newGenre,
        "genre"
      )}
         RETURNING *;
      `;
  return genre[0];
};

exports.deleteGenre = async (id) => {
  const genre = await sql`
   DELETE FROM genres
   WHERE genres.id = ${id}
   returning *
    `;
  return genre;
};

exports.updateGenre = async (id, updatedGenre) => {
  const genre = await sql`
    update genres set ${sql(
      updatedGenre,
      "genre"
    )}
    where id = ${id}
    returning *;
  `;
  return genre[0];
};

exports.getAllGenres = async () => {
  const genreList = await sql`
SELECT *
FROM genres
    `;
  return genreList;
};