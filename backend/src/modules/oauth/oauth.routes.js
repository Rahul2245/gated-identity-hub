const express=require("express");

const router =express.Router();
const {registerClient}=require("./oauth.controller");

const authMiddleware=require("../../middlewares/auth.middleware");

router.post(
    "/clients",authMiddleware,registerClient
)

module.exports = router;