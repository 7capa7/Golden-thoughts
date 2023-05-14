import dotenv from "dotenv";
dotenv.config();
import express from "express";
import config from "config";
import { log } from "./utils/logger";
import { AppDataSource } from './db-config'

const app = express();
const port = config.get('port');

AppDataSource.initialize()
    .then(()=>{
        log.info("Succesfully connected with database");
    })
    .catch((err) =>{
        log.error(`Could not connect with database: ${err}`);
    })

app.listen(port, () => {
    log.info(`App started at http://localhost:${port}`);
});
