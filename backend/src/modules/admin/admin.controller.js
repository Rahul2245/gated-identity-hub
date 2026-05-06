const { pool } = require("../../config/db");

const getAllSessions = async (req, res) => {
    const result = await pool.query(
        "SELECT id, user_id, is_revoked, expires_at FROM refresh_tokens ORDER BY id DESC"
    );

    res.json(result.rows);
};

const revokeSession = async (req, res) => {
    const { tokenId } = req.body;

    await pool.query(
        "UPDATE refresh_tokens SET is_revoked = true WHERE id = $1",
        [tokenId]
    );

    res.json({ message: "Session revoked" });
};

module.exports = {
    getAllSessions,
    revokeSession,
};