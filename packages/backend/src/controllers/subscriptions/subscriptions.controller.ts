import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { UserDataDto } from 'src/dto/user-data.dto';
import { SubscriptionsBody } from './dto/subscriptions-body.dto';
import { CreateDataDto } from 'src/dto/create-data.dto';
import { SubscriptionsData } from './dto/subscriptions-data.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Подписка на вакансии')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение списка подписок',
  })
  @ApiResponse({
    status: 200,
    type: SubscriptionsData,
    isArray: true,
  })
  @Throttle(5, 5)
  async getSubscriptions(
    @Headers('user') user: UserDataDto,
  ): Promise<SubscriptionsData[]> {
    return await this.subscriptionsService.getSubscriptions(user);
  }

  @Post()
  @ApiOperation({
    summary: 'Подписка на вакансии',
  })
  @ApiResponse({
    status: 200,
    type: CreateDataDto,
  })
  @Throttle(5, 10)
  async subscribe(
    @Headers('user') user: UserDataDto,
    @Body() body: SubscriptionsBody,
  ): Promise<CreateDataDto> {
    return await this.subscriptionsService.subscribe(user, body);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Отписка от вакансии',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @Throttle(5, 10)
  async unsubscribe(
    @Headers('user') user: UserDataDto,
    @Param('id') id: number,
  ): Promise<boolean> {
    return await this.subscriptionsService.unsubscribe(user, id);
  }
}
