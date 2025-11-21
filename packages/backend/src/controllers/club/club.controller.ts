import { Controller, Headers, Delete, Post, Get, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClubService } from './club.service';
import { UserDataDto } from 'src/dto/user-data.dto';
import { ClubData } from './dto/club-data.dto';
import { ClubPostBody } from './dto/club-body.dto';

@ApiTags('Jobazavr Club')
@Controller('club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @ApiOperation({
    summary: 'Получение карты клуба',
  })
  @ApiResponse({
    status: 200,
    type: ClubData,
  })
  @Get()
  async getClubCard(@Headers('user') user: UserDataDto): Promise<ClubData> {
    return await this.clubService.getClubCard(user);
  }

  @ApiOperation({
    summary: 'Получение карты клуба для добавления в Wallet',
  })
  @ApiResponse({
    status: 200,
    type: String,
  })
  @Get('/pkpass')
  async getClubCardForWallet(
    @Headers('user') user: UserDataDto,
  ): Promise<string> {
    return await this.clubService.getPkpass(user);
  }

  @ApiOperation({
    summary: 'Получение карты клуба для добавления в Wallet',
  })
  @ApiResponse({
    status: 200,
    type: String,
  })
  @Get('/pkpass/image')
  async getImage(@Headers('user') user: UserDataDto): Promise<string> {
    return await this.clubService.getImage(user);
  }

  @ApiOperation({
    summary: 'Создание карты клуба через форму',
  })
  @ApiResponse({
    status: 200,
    type: ClubData,
  })
  @Post('/form')
  async createClubCardByForm(
    @Headers('user') user: UserDataDto,
    @Body() body: ClubPostBody,
  ): Promise<ClubData> {
    return await this.clubService.createClubCardByForm(user, body);
  }

  @ApiOperation({
    summary: 'Удаление карты клуба',
  })
  @ApiResponse({
    status: 200,
    type: ClubData,
  })
  @Delete()
  async deleteClubCard(@Headers('user') user: UserDataDto): Promise<boolean> {
    return await this.clubService.deleteClubCard(user);
  }
}
