import * as dotenv from "dotenv"; // Делаем доступными переменные окружения
dotenv.config();

import { AppDataSource } from "./data-source";
import botInstance from "./bot";

// Подключаемся к базе и только уже потом запускаем бота
AppDataSource.initialize()
  .then(async () => {
    console.log("Database connection initialized");

    await botInstance();
  })
  .catch((e) => console.log(e));
