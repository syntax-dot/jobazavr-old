import axios from 'axios';

const replyToEmployer = async (message: string): Promise<boolean> => {
  await axios.get(
    `https://api.telegram.org/bot${
      process.env.TG_NOTIFY_BOT_TOKEN
    }/sendMessage?text=${encodeURI(message)}&chat_id=${
      process.env.TG_NOTIFY_CHANNEL_ID
    }`,
  );

  return true;
};

export default replyToEmployer;
