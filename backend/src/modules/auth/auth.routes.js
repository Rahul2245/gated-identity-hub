const express = require("express");
const { requestMagicLink, verifyMagicLink,} = require("./auth.controller");
const { refreshTokenHandler } = require("./auth.refresh.controller");

const router = express.Router();

router.post("/request-link", requestMagicLink);
router.get("/verify", verifyMagicLink);
router.post("/refresh", refreshTokenHandler);

module.exports = router;