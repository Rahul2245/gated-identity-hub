const { pool } = require("../../config/db");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../../utils/jwt");

const refreshTokenHandler = async (req,res )=>{
    try{
         const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "No refresh token",
            });
        }

        // Get all tokens from DB
        const result = await pool.query(
            "SELECT * FROM refresh_tokens WHERE is_revoked = false"
        );

        let validToken = null;

        for(let token of result.rows){
            const isMatch = await bcrypt.compare(
                refreshToken,
                token.hashed_token
            );
            if (isMatch) {
                validToken = token;
                break;
            }
        }

        if (!validToken) {
            return res.status(403).json({
                message: "Invalid refresh token",
            });
        }

        // Check expiry
        if (new Date() > validToken.expires_at) {
            return res.status(403).json({
                message: "Refresh token expired",
            });
        }

        // Get user
        const userRes = await pool.query(
            "SELECT * FROM users WHERE id=$1",
            [validToken.user_id]
        );

         const user = userRes.rows[0];

         // Generate new access token
        const newAccessToken = generateAccessToken({
            id: user.id,
            role: user.role,
        });

        // Send new access token cookie
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

         res.json({
            message: "Access token refreshed",
        });

    }catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error",
        });
    }
}

module.exports = {
    refreshTokenHandler,
};