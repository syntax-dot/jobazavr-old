import { Body, Controller, Delete, Get, Headers, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UserDataDto } from 'src/dto/user-data.dto';
import { InitializeData } from '../initialize/dto/initialize-data.dto';
import { ProfilePatchBody } from './dto/profile-body.dto';
import { ProfileService } from './profile.service';

@ApiTags('Модуль профиля')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({
    summary: 'Инициализация приложения',
  })
  @ApiResponse({
    status: 200,
    type: InitializeData,
  })
  @Throttle(1, 2)
  async initialize(
    @Headers('user') user: UserDataDto,
  ): Promise<InitializeData> {
    return await this.profileService.getProfile(user);
  }

  @Patch()
  @ApiOperation({
    summary: 'Обновление данных профиля',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @Throttle(1, 5)
  async updateProfile(
    @Headers('user') user: UserDataDto,
    @Body() body: ProfilePatchBody,
  ): Promise<boolean> {
    return await this.profileService.updateProfile(user, body);
  }

  @Delete()
  @ApiOperation({
    summary: 'Удаление профиля',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @Throttle(1, 5)
  async deleteProfile(@Headers('user') user: UserDataDto): Promise<boolean> {
    return await this.profileService.deleteProfile(user);
  }
}
