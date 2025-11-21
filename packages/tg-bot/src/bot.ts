import * as TelegramBot from "node-telegram-bot-api";
import messagesHandler from "./handlers/messages.handler";

const botInstance = async () => {
  const bot = new TelegramBot(process.env.BOT_TOKEN, {
    filepath: false,
    polling: true,
  });

  bot.on(
    "message",
    async (ctx: TelegramBot.Message) => await messagesHandler({ bot, ctx })
  );
};

export default botInstance;
