import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AdminUserData } from './dto/user-data.dto';
import { UserService } from './user.service';

@ApiTags('Админ-панель: Получение данных пользователя')
@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:vk_user_id')
  @ApiOperation({
    summary: 'Получение данных пользователя',
  })
  @ApiResponse({
    status: 200,
    type: AdminUserData,
  })
  @Throttle(1, 2)
  async getUserData(
    @Param('vk_user_id') vk_user_id: number,
  ): Promise<AdminUserData> {
    return await this.userService.getUserData(vk_user_id);
  }
}
