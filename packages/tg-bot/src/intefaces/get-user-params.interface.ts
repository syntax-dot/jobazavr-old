import TelegramBot from "node-telegram-bot-api";
import { Users } from "../entities/users.entity";
import { Repository } from "typeorm";

export interface GetUserParams {
  ctx: TelegramBot.Message | TelegramBot.CallbackQuery;
  usersRepository: Repository<Users>;
}
