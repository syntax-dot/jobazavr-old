import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UserDataDto } from 'src/dto/user-data.dto';
import { EmployersData, JobsData } from './dto/jobs-data.dto';
import {
  JobsFiltersDataQueryDto,
  JobsQueryDto,
  JobsQueryGetDto,
} from './dto/jobs-query.dto';
import { JobsService } from './jobs.service';

@ApiTags('Вакансии')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('/filtersData')
  @ApiOperation({
    summary: 'Получение списка работодателей и вакансий',
  })
  @ApiResponse({
    status: 200,
    type: EmployersData,
  })
  async getEmployersAndVacancies(
    @Query() query: JobsFiltersDataQueryDto,
  ): Promise<EmployersData> {
    return await this.jobsService.getEmployersAndVacancies(query);
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
  ): Promise<JobsData[]> {
    return await this.jobsService.getJobsByCity(id, query);
  }

  @Get('/id/:id')
  @ApiOperation({
    summary: 'Получение вакансии по ее ID',
  })
  @ApiResponse({
    status: 200,
    type: JobsData,
  })
  async getJobsById(@Param('id') id: number): Promise<JobsData> {
    return await this.jobsService.getJobsById(id);
  }

  @Post('/view/:id')
  @ApiOperation({
    summary: 'Просмотр вакансии',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @Throttle(1, 2)
  async view(@Param('id') id: number): Promise<boolean> {
    return await this.jobsService.view(id);
  }

  @Get('/nearby')
  @ApiOperation({
    summary: 'Получение вакансий рядом по координатам',
  })
  @ApiResponse({
    status: 200,
    type: JobsData,
    isArray: true,
  })
  async getJobs(@Query() query: JobsQueryDto): Promise<JobsData[]> {
    return await this.jobsService.getJobs(query);
  }

  @Get('/favorites')
  @ApiOperation({
    summary: 'Получение избранных вакансий',
  })
  @ApiResponse({
    status: 200,
    type: JobsData,
    isArray: true,
  })
  async getFavorites(
    @Query() query: JobsQueryGetDto,
    @Headers('user') user: UserDataDto,
  ): Promise<JobsData[]> {
    return await this.jobsService.getFavorites(user, query);
  }

  @Post('/favorites/:id')
  @ApiOperation({
    summary: 'Добавление вакансии в избранное',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async addToFavorites(
    @Param('id') id: number,
    @Headers('user') user: UserDataDto,
  ): Promise<boolean> {
    return await this.jobsService.addToFavorites(user, id);
  }

  @Delete('/favorites/:id')
  @ApiOperation({
    summary: 'Удаление вакансии из избранного',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async removeFromFavorites(
    @Param('id') id: number,
    @Headers('user') user: UserDataDto,
  ): Promise<boolean> {
    return await this.jobsService.removeFromFavorites(user, id);
  }

  @Post('/reply/:id')
  @ApiOperation({
    summary: 'Отклик на вакансию',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @Throttle(1, 2)
  async replyOnJob(
    @Param('id') id: number,
    @Headers('user') user: UserDataDto,
  ): Promise<boolean> {
    return await this.jobsService.replyOnJob(id, user);
  }
}
