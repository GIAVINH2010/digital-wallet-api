import { Request, Response } from "express";
import { CustomError } from "../../core/utils/customError";

import authService from "../../services/authService";

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login({ username, password });

    if (result) {
      return res
        .status(200)
        .send({ message: "LOGIN_SUCCESSFULLY", token: result });
    }
  } catch (error) {
    console.log("error", error);
    if (error.name === "CustomError") {
      return res.status(error.status).send(error);
    }
    return res.status(500).send({ message: "Server Error" });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const result = await authService.register({ email, username, password });

    if (result) {
      return res.status(200).send({ message: "REGISTER_SUCCESSFULLY" });
    }
  } catch (error) {
    console.log("error", error);
    if (error.name === "CustomError") {
      return res.status(error.status).send(error);
    }
    return res.status(500).send({ message: "Server Error" });
  }
};

export default { login, register };
