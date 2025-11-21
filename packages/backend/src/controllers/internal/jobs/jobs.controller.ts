import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';

@ApiTags('INTERNAL / Вакансии')
@Controller('internal/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Delete('/:company_id/:job_id')
  @ApiOperation({
    summary: 'Удаление работы по её ID',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async deleteJob(
    @Param('company_id') company_id: number,
    @Param('job_id') job_id: number,
  ): Promise<void> {
    await this.jobsService.deleteJob(company_id, job_id);
  }

  @Patch('/:company_id')
  @ApiOperation({
    summary: 'Создание работ',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async createJobs(
    @Param('company_id') company_id: number,
    @Body() body,
  ): Promise<boolean> {
    return await this.jobsService.createJobs(company_id, body);
  }
}
