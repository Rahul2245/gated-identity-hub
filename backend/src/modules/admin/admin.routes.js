const express = require("express");
const router = express.Router();

const {
    getAllSessions,
    revokeSession,
} = require("./admin.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const requireRole = require("../../middlewares/rbac.middleware");

router.get(
    "/sessions",
    authMiddleware,
    requireRole("admin"),
    getAllSessions
);

router.post(
    "/revoke",
    authMiddleware,
    requireRole("admin"),
    revokeSession
);

module.exports = router;