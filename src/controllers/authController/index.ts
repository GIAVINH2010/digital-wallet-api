import { Request, Response } from "express";

import authService from "../../services/authService";

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login({ username, password });

    return res.status(200).send(result);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({ message: "Server Error" });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const result = await authService.register({ email, username, password });

    return res.status(200).send(result);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({ message: "Server Error" });
  }
};

export default { login, register };
