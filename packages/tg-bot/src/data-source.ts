import "reflect-metadata";
import { DataSource } from "typeorm";

// Создаем инстанс базы данных
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  extra: {
    connectionLimit: +process.env.DB_CONNECTION_LIMIT,
  },
  cache: false,
  charset: "utf8mb4_general_ci",
  logging: false,
  entities: [__dirname + "/entities/*.entity.{ts,js}"],
  migrations: [],
  subscribers: [],
});
