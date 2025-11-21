import { Controller, Post, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDataDto } from 'src/dto/user-data.dto';
import { BotService } from './bot.service';

@ApiTags('Телеграм: бот')
@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('/phone')
  async phone(@Headers('user') user: UserDataDto): Promise<boolean> {
    return await this.botService.phone(user);
  }
}
