import dotenv from "dotenv";
dotenv.config();
import express from "express";
import config from "config";
import { log } from "./utils/logger";
import { AppDataSource } from "./db-config";
import authRouter from "./router/auth.router";
import bodyParser from "body-parser";

const app = express();
const port = config.get("port");

AppDataSource.initialize()
  .then(() => {
    log.info("Succesfully connected with database");
  })
  .catch((err) => {
    log.error(`Could not connect with database: ${err}`);
  });

app.use(bodyParser.json());
app.use(authRouter);

app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);
});
