import TelegramBot from "node-telegram-bot-api";
import Messages from "../enums/messages.enum";
import sendMessage from "../utilities/sendMessage.utils";
import { AppDataSource } from "../data-source";
import getUser from "../utilities/getUser.utils";
import { Users } from "../entities/users.entity";
import { UserData } from "../intefaces/user-data.interface";
import Keyboards from "../enums/keyboards.enum";
import * as fs from "fs";

interface MessagesHandlerParams {
  bot: TelegramBot;
  ctx: TelegramBot.Message;
}

const messagesHandler = async ({
  bot,
  ctx,
}: MessagesHandlerParams): Promise<any> => {
  const usersRepository = AppDataSource.getRepository(Users);

  const user: UserData = await getUser({ ctx, usersRepository });

  const webAppData = ctx?.web_app_data?.data
    ? JSON.parse(ctx?.web_app_data?.data)
    : null;

  if (webAppData) {
    switch (webAppData?.type) {
      case "requestPhone":
        await sendMessage({
          bot,
          user_id: user.user_id,
          message: Messages.REQUEST_PHONE,
          isInline: true,
          keyboard: Keyboards.SEND_PHONE_NUMBER,
        });
        break;
    }
  }

  if (ctx?.contact && ctx?.contact?.user_id === +user.user_id) {
    let onboarding = true;

    if (!user.onboarding) {
      if (user.city_id && user.citizenship_id && user.age) {
        onboarding = false;
      } else {
        onboarding = true;
      }
    }

    await usersRepository
      .createQueryBuilder()
      .update(Users)
      .set({
        phone: ctx.contact.phone_number,
        onboarding,
      })
      .where("user_id = :user_id", { user_id: user.user_id })
      .execute();

    return await sendMessage({
      bot,
      user_id: user.user_id,
      message: Messages.PHONE_SAVED,
      isInline: true,
      keyboard: Keyboards.WEB_APP,
    });
  }

  switch (ctx?.text) {
    default:
      await bot.sendSticker(
        user.user_id,
        fs.createReadStream("src/static/sticker.webp")
      );

      await sendMessage({
        bot,
        message: Messages.START_MESSAGE,
        user_id: user.user_id,
        isInline: true,
        parse_mode: "Markdown",
        keyboard: Keyboards.WEB_APP,
      });
      break;
  }
};

export default messagesHandler;
