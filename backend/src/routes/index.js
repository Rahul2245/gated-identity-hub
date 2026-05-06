const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/rbac.middleware");
const adminRoutes = require("../modules/admin/admin.routes");

const router = express.Router();

// Health Route
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running",
        time: new Date().toISOString()
    });
});

//protected route
router.get("/protected",authMiddleware,(req,res)=>{
    res.json({
        message: "You are authenticated",
        user: req.user,
    });
});

//Admin only route
router.get(
    "/admin",
    authMiddleware,
    requireRole("admin"),
    (req, res) => {
        res.json({
            message: "Welcome Admin",
        });
    }
);


router.use("/admin", adminRoutes);

router.use("/auth",authRoutes);

module.exports = router;