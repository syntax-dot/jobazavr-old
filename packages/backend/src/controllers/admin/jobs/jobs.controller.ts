import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { AdminJobsDelete, AdminJobsPatchBody } from './dto/jobs-body.dto';

@ApiTags('Админ-панель: Вакансии')
@Controller('admin/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Patch('/:job_id')
  @ApiOperation({
    summary: 'Обновление вакансии по идентификатору',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async updateJob(
    @Param('job_id') job_id: number,
    @Body() body: AdminJobsPatchBody,
  ): Promise<boolean> {
    return this.jobsService.updateJob(job_id, body);
  }

  @Delete('/:job_id')
  @ApiOperation({
    summary: 'Удаление вакансии по идентификатору',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async deleteJob(@Param('job_id') job_id: number): Promise<boolean> {
    return this.jobsService.deleteJob(job_id);
  }

  @Delete()
  @ApiOperation({
    summary: 'Удаление вакансии по имени работодателя',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async deleteByTitleJob(@Body() body: AdminJobsDelete): Promise<boolean> {
    return this.jobsService.deleteJobByName(body);
  }

  @Post('/export')
  @ApiOperation({
    summary: 'Экспорт вакансий (ответ - URL для загрузки файла)',
  })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async exportJobs(): Promise<string> {
    return this.jobsService.exportJobs();
  }
}
