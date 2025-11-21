import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { GetDataDto } from 'src/dto/get-data.dto';
import { CitiesService } from './cities.service';
import { CitiesData } from './dto/cities-data.dto';

@ApiTags('Города')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение городов',
  })
  @ApiResponse({
    status: 200,
    type: CitiesData,
    isArray: true,
  })
  @SkipThrottle()
  async getCities(@Query() query: GetDataDto): Promise<CitiesData[]> {
    return await this.citiesService.getCities(query);
  }
}
