import { Controller, Delete, Get, Headers, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDataDto } from 'src/dto/user-data.dto';
import { JobsData } from './dto/jobs-data.dto';
import { JobsQueryDeleteDto, JobsQueryGetDto } from './dto/jobs-query.dto';
import { JobsService } from './jobs.service';

@ApiTags('Вакансии')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение вакансий',
  })
  @ApiResponse({
    status: 200,
    type: JobsData,
    isArray: true,
  })
  async getJobs(
    @Headers('user') user: UserDataDto,
    @Query() query: JobsQueryGetDto,
  ): Promise<JobsData[]> {
    return await this.jobsService.getJobs(query, user);
  }

  @Get('/city/:id')
  @ApiOperation({
    summary: 'Получение вакансий по городу',
  })
  @ApiResponse({
    status: 200,
    type: JobsData,
    isArray: true,
  })
  async getJobsByCity(
    @Param('id') id: number,
    @Query() query: JobsQueryGetDto,
    @Headers('user') user: UserDataDto,
  ): Promise<JobsData[]> {
    return await this.jobsService.getJobsByCity(id, query, user);
  }

  @Get('/id/:id')
  @ApiOperation({
    summary: 'Получение вакансии по ее ID',
  })
  @ApiResponse({
    status: 200,
    type: JobsData,
  })
  async getJobsById(
    @Headers('user') user: UserDataDto,
    @Param('id') id: number,
    @Query() query: JobsQueryGetDto,
  ): Promise<JobsData> {
    return await this.jobsService.getJobsById(id, user, query);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Удаление вакансии по ее ID',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async deleteJobsById(
    @Headers('user') user: UserDataDto,
    @Param('id') id: number,
    @Query() query: JobsQueryDeleteDto,
  ): Promise<boolean> {
    return await this.jobsService.deleteJobsById(id, user, query);
  }
}
