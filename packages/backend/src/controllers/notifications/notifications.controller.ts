import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { UserDataDto } from 'src/dto/user-data.dto';
import { GetDataDto } from 'src/dto/get-data.dto';
import { NotificationsCreateBody } from './dto/notifications-body.dto';
import { OrdersGetData } from './dto/notifications-data.dto';
import { CreateDataDto } from 'src/dto/create-data.dto';

@ApiTags('Уведомления (для всех платформ кроме VK & TG)')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение устройств пользователя',
  })
  @ApiResponse({
    status: 200,
    type: OrdersGetData,
    isArray: true,
  })
  async getDevices(
    @Headers('user') user: UserDataDto,
    @Query() query: GetDataDto,
  ): Promise<OrdersGetData[]> {
    return await this.notificationsService.getDevices(user, query);
  }

  @Post()
  @ApiOperation({
    summary: 'Добавление устройства',
  })
  @ApiResponse({
    status: 200,
    type: CreateDataDto,
  })
  async createDevice(
    @Headers('user') user: UserDataDto,
    @Body() body: NotificationsCreateBody,
  ): Promise<CreateDataDto> {
    return await this.notificationsService.createDevice(user, body);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Удаление устройства',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async deleteDevice(
    @Headers('user') user: UserDataDto,
    @Param('id') id: number,
  ): Promise<boolean> {
    return await this.notificationsService.deleteDevice(user, id);
  }
}
