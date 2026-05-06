const {loginUser} =require("../../services/auth.service");
const { pool } = require("../../config/db");


//magic link request
const requestMagicLink = async (req, res) => {
    const { email } = req.body;

    
    const magicLink = `http://localhost:${process.env.PORT}/api/auth/verify?email=${email}`;

    console.log("MAGIC LINK:", magicLink);

    res.json({ message: "Magic link sent (check console)" });
};

//verifying logic link
const verifyMagicLink = async (req,res)=>{
    const {email}=req.query;
    const {accessToken, refreshToken}=await loginUser(email);

    //setting cookies-accesstoken
    res.cookie("accessToken",accessToken,{
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });

    //setting cookies-refreshtoken
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Logged in successfully" });

}

//get all sessions
const getAllSessions = async (req, res) => {
    const result = await pool.query(
        "SELECT id, user_id, is_revoked, expires_at FROM refresh_tokens ORDER BY id DESC"
    );

    res.json(result.rows);
};

const revokeSession = async (req,res)=>{
    const {tokenId}=req.body;

    await pool.query(
           "UPDATE refresh_tokens SET is_revoked = true WHERE id = $1",
        [tokenId]
    );

    res.json({message: "Session revoked"})
}



module.exports = {
    requestMagicLink,
    verifyMagicLink,
    getAllSessions,
    revokeSession,
};