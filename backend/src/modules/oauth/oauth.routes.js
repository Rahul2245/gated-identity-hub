const express=require("express");

const router =express.Router();
const {registerClient,getClients,removeClient, authorize, approveConsent}=require("./oauth.controller");

const authMiddleware=require("../../middlewares/auth.middleware");

router.post(
    "/clients",authMiddleware,registerClient
);
router.get(
    "/clients",authMiddleware,getClients
);
router.delete(
    "/clients/:id",authMiddleware,removeClient
);
router.get(
    "/authorize",authMiddleware,authorize
)
router.post(
    "/consent/approve",
    authMiddleware,
    approveConsent
)

module.exports = router;