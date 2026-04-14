const {pool}=require("../config/db");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/jwt");
const { generateRefreshToken } = require("../utils/token");

const createOrGetUser = async (email) =>{
    const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",[email]
    );
      if (result.rows.length > 0) return result.rows[0];

    const newUser = await pool.query(
        "INSERT INTO users (email) VALUES ($1) RETURNING *",
        [email]
    );

    return newUser.rows[0];
};

const loginUser = async (email) => {
    const user = await createOrGetUser(email);

    const accessToken = generateAccessToken({
        id: user.id,
        role: user.role,
    });

    const refreshToken = generateRefreshToken();

    const hashedToken = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await pool.query(
        `INSERT INTO refresh_tokens (user_id, hashed_token, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, hashedToken, expiresAt]
    );

    return { accessToken, refreshToken };
};

module.exports = {
    loginUser,
};