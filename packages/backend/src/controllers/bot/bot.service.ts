import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserDataDto } from 'src/dto/user-data.dto';
import Errors from 'src/errors.enum';
import errorGenerator from 'src/utils/errorGenerator.utils';

@Injectable()
export class BotService {
  async phone(user: UserDataDto): Promise<boolean> {
    if (user.platform !== 'tg') errorGenerator(Errors.BAD_REQUEST);

    await axios.get(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_KEY}/sendMessage?text=%D0%94%D0%BB%D1%8F%20%D1%82%D0%BE%D0%B3%D0%BE%2C%20%D1%87%D1%82%D0%BE%D0%B1%D1%8B%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BE%D0%B4%D0%B0%D1%82%D0%B5%D0%BB%D0%B8%20%D0%BC%D0%BE%D0%B3%D0%BB%D0%B8%20%D1%81%D0%B2%D1%8F%D0%B7%D0%B0%D1%82%D1%8C%D1%81%D1%8F%20%D1%81%20%D0%B2%D0%B0%D0%BC%D0%B8%20%D0%BF%D0%BE%20%D0%BF%D0%BE%D0%B2%D0%BE%D0%B4%D1%83%20%D0%B2%D0%B0%D0%BA%D0%B0%D0%BD%D1%81%D0%B8%D0%B9%2C%20%D0%BF%D0%BE%D0%B6%D0%B0%D0%BB%D1%83%D0%B9%D1%81%D1%82%D0%B0%2C%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D1%8C%D1%82%D0%B5%20%D1%81%D0%B2%D0%BE%D0%B9%20%D0%BD%D0%BE%D0%BC%D0%B5%D1%80%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%B0.%0A%0A%D0%9C%D1%8B%20%D0%B1%D1%83%D0%B4%D0%B5%D0%BC%20%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D0%B5%D0%B3%D0%BE%20%D1%82%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D0%B4%D0%BB%D1%8F%20%D1%86%D0%B5%D0%BB%D0%B5%D0%B9%20%D1%82%D1%80%D1%83%D0%B4%D0%BE%D1%83%D1%81%D1%82%D1%80%D0%BE%D0%B9%D1%81%D1%82%D0%B2%D0%B0.%0A%0A%D0%A1%D0%BF%D0%B0%D1%81%D0%B8%D0%B1%D0%BE!&chat_id=${user.user_id}&reply_markup={%22keyboard%22:[[{%22text%22:%22%D0%9E%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D1%8C%20%D0%BD%D0%BE%D0%BC%D0%B5%D1%80%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%B0%22,%22request_contact%22:true}]],%22resize_keyboard%22:true}`,
    );

    return true;
  }
}
