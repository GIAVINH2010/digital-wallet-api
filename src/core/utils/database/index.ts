import dotenv from "dotenv";
import { connect } from "mongoose";
dotenv.config();

const dbUser = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const initDBConnection = () =>
  connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tisqo.mongodb.net/${dbName}?retryWrites=true&w=majority`
  )
    .then(() => console.log("Database connected"))
    .catch((error) => {
      console.log("Cannot connect database");
      console.error(error);
    });

export { initDBConnection };
