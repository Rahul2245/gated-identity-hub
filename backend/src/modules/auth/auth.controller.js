const {loginUser} =require("../../services/auth.service");



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




module.exports = {
    requestMagicLink,
    verifyMagicLink,
   
};