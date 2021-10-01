import { Router } from "express";
import auth from "./auth";
import wallet from "./wallet";

const routes = Router();

routes.use("/auth", auth);
routes.use("/wallet", wallet);

export default routes;
