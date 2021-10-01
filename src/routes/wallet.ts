import { Router } from "express";

import { checkJwt } from "../middlewares/auth";

import walletController from "../controllers/walletController";

const router = Router();

router.use(checkJwt);

router.get("/", walletController.getWallet);
router.post("/sendFund", walletController.sendFund);

export default router;
