const sql = require('../utils/postgres');

exports.createUser = async (newUser) => {
    const { email, password } = newUser;

    const user = await sql`
    INSERT INTO users ${sql(
        { email, password },
        'email',
        'password'
    )}
    RETURNING *
    `;
    return user[0];
};

exports.getUserByEmail = async (email) => {
    const users = await sql`
        SELECT *
        FROM users
        WHERE users.email = ${email}
        LIMIT 1;
    `;
    return users.length ? users[0] : undefined;
};

exports.getUserById = async (id) => {
  const users = await sql`
    SELECT * FROM users WHERE id = ${id}
  `;
  return users[0];
};