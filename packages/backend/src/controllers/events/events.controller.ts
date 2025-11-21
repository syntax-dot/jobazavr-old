import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UserDataDto } from 'src/dto/user-data.dto';
import { EventsBody } from './dto/events-body.dto';
import { EventsService } from './events.service';

@ApiTags('Статистка (events)')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({
    summary: 'Создание события',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @Throttle(1, 2)
  async createEvent(
    @Body() body: EventsBody,
    @Headers('user') user: UserDataDto,
  ): Promise<boolean> {
    return await this.eventsService.createEvent(user, body);
  }
}
