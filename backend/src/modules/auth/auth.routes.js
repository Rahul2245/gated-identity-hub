const express = require("express");
const { requestMagicLink, verifyMagicLink,} = require("./auth.controller");

const router = express.Router();

router.post("/request-link", requestMagicLink);
router.get("/verify", verifyMagicLink);

module.exports = router;