import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { initDBConnection } from "./core/utils/database";
import seeding from "./core/utils/database/seed";
import routes from "./routes";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

//Set all routes from routes folder
app.use("/api", routes);

app.listen(PORT, async () => {
  await initDBConnection();
  // await seeding();
  console.log(`Listening on port ${PORT}`);
});
