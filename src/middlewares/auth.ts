import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtSecretKey = process.env.JWT_SECRET_KEY || "tuheumapdit";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers["authorization"].split(" ")[1];

  //Try to validate the token and get data
  try {
    const decoded = <any>jwt.verify(token, jwtSecretKey);
    res.locals.jwtPayload = decoded;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
    return;
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  // const { userId, username } = jwtPayload;
  // const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
  //   expiresIn: "1h",
  // });
  // res.setHeader("token", newToken);

  //Call the next middleware or controller
  next();
};
