import TelegramBot from "node-telegram-bot-api";

interface SendMessageParams {
  bot: TelegramBot;
  user_id: number;
  message: string;
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
  isInline?: boolean;
  keyboard?: any;
  removeKeyboard?: boolean;
}

const sendMessage = async ({
  bot,
  user_id,
  message,
  parse_mode = "HTML",
  isInline = false,
  keyboard = null,
  removeKeyboard = false,
}: SendMessageParams): Promise<number> => {
  const opts: any = {
    reply_markup: removeKeyboard
      ? JSON.stringify({ remove_keyboard: true })
      : keyboard
      ? isInline
        ? JSON.stringify({ inline_keyboard: keyboard })
        : JSON.stringify({ keyboard, resize_keyboard: true })
      : undefined,
  };

  const sendedMessage = await bot.sendMessage(user_id, message, {
    parse_mode,
    ...opts,
  });

  return sendedMessage.message_id;
};

export default sendMessage;
