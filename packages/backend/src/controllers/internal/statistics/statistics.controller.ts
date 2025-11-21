import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { StatisticsData } from './dto/statistics-data.dto';
import { StatisticsQueryDto } from './dto/statistics-query.dto';

@ApiTags('INTERNAL / Статистика по вакансиям')
@Controller('internal/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/:company_id')
  @ApiOperation({
    summary: 'Получение статистики по вакансиям компании',
  })
  @ApiResponse({
    status: 200,
    type: StatisticsData,
    isArray: true,
  })
  async getStatisticsByCompanyId(
    @Param('company_id') company_id: number,
  ): Promise<StatisticsData[]> {
    return await this.statisticsService.getStatisticsByCompanyId(company_id);
  }

  @Get('/:company_id/:job_id')
  @ApiOperation({
    summary: 'Получение статистики по вакансии',
  })
  @ApiResponse({
    status: 200,
    type: StatisticsData,
  })
  async getStatisticsByJobId(
    @Param('company_id') company_id: number,
    @Param('job_id') job_id: number,
    @Query() query: StatisticsQueryDto,
  ): Promise<StatisticsData> {
    return await this.statisticsService.getStatisticsByJobId(
      company_id,
      job_id,
      query,
    );
  }
}
