import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LegalAidService } from './legal-aid.service';
import { LegalAidBody } from './dto/legal-aid-body.dto';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Юридическая помощь')
@Controller('legal-aid')
export class LegalAidController {
  constructor(private readonly legalAidService: LegalAidService) {}

  @Post()
  @ApiOperation({
    summary: 'Отправка заявки на помощь',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @Throttle(1, 5)
  async create(
    @Headers('user') user: UserDataDto,
    @Body() body: LegalAidBody,
  ): Promise<boolean> {
    return await this.legalAidService.create(user, body);
  }
}
