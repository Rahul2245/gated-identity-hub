const express = require("express");

const router = express.Router();

// Health Route
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running",
        time: new Date().toISOString()
    });
});

module.exports = router;