import { Body, Controller, Headers, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDataDto } from 'src/dto/user-data.dto';
import { ProfilePatchBody } from './dto/profile-body.dto';
import { ProfileService } from './profile.service';
import { ProfileData } from './dto/profile-data.dto';

@ApiTags('Модуль профиля')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch()
  @ApiOperation({
    summary: 'Обновление данных профиля',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    type: ProfileData,
  })
  async updateProfile(
    @Headers('user') user: UserDataDto,
    @Body() body: ProfilePatchBody,
  ): Promise<boolean | ProfileData> {
    return await this.profileService.updateProfile(user, body);
  }
}
