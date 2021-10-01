import { Router } from "express";

import { checkJwt } from "../middlewares/auth";

import authController from "../controllers/authController";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
