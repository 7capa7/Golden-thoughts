import { DataSource } from "typeorm";
import config from "config";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.get("db_host"),
  port: config.get("db_port"),
  username: config.get("db_username"),
  password: config.get("db_password"),
  database: config.get("db_name"),
  dropSchema: true,
  synchronize: true,
  entities: [User],
});
