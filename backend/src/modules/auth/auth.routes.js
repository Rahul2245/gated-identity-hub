const express = require("express");
const { requestMagicLink, verifyMagicLink,getAllSessions,
    revokeSession,} = require("./auth.controller");
const { refreshTokenHandler } = require("./auth.refresh.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const requireRole = require("../../middlewares/rbac.middleware");

const router = express.Router();

router.post("/request-link", requestMagicLink);
router.get("/verify", verifyMagicLink);
router.post("/refresh", refreshTokenHandler);





module.exports = router;