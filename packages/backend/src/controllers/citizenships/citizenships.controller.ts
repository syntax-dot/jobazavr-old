import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CitizenshipsService } from './citizenships.service';
import { CitizenshipsDataDto } from './dto/citizenships-data.dto';

@ApiTags('Гражданства')
@Controller('citizenships')
export class CitizenshipsController {
  constructor(private readonly citizenshipsService: CitizenshipsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение гражданств',
  })
  @ApiResponse({
    status: 200,
    type: CitizenshipsDataDto,
    isArray: true,
  })
  @Throttle(1, 2)
  async getCitizenships(): Promise<CitizenshipsDataDto[]> {
    return await this.citizenshipsService.getCitizenships();
  }
}
