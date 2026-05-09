const express=require("express");

const router =express.Router();
const {registerClient,getClients,removeClient}=require("./oauth.controller");

const authMiddleware=require("../../middlewares/auth.middleware");

router.post(
    "/clients",authMiddleware,registerClient
);
router.get(
    "/clients",authMiddleware,getClients
);
router.delete(
    "/clients/:id",authMiddleware,removeClient
)

module.exports = router;