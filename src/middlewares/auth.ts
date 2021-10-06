import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtSecretKey = process.env.JWT_SECRET_KEY || "tuheumapdit";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  try {
    //Get the jwt token from the head
    const token = <string>req.headers["authorization"].split(" ")[1];

    const decoded = <any>jwt.verify(token, jwtSecretKey);
    res.locals.jwtPayload = decoded;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    return res.status(401).send();
  }

  //Call the next middleware or controller
  next();
};
