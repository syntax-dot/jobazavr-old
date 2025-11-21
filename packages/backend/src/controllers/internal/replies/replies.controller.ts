import { Controller, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RepliesService } from './replies.service';
import { RepliesQueryDto } from './dto/replies-query.dto';
import { ExternalRepliesData } from './dto/replies-data.dto';

@ApiTags('INTERNAL / Отклики')
@Controller('internal/replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post('/:company_id/:job_id')
  @ApiOperation({
    summary: 'Выгрузка откликов',
  })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async getRepliesByJobId(
    @Param('company_id') company_id: number,
    @Param('job_id') job_id: number,
    @Query() query: RepliesQueryDto,
  ): Promise<string> {
    return await this.repliesService.getRepliesByJobId(
      company_id,
      job_id,
      query,
    );
  }

  @Post('/:company_id/:job_id/json')
  @ApiOperation({
    summary: 'Получение откликов',
  })
  @ApiResponse({
    status: 200,
    type: ExternalRepliesData,
    isArray: true,
  })
  async getRepliesByJobIdJson(
    @Param('company_id') company_id: number,
    @Param('job_id') job_id: number,
    @Query() query: RepliesQueryDto,
  ): Promise<ExternalRepliesData[]> {
    return await this.repliesService.getRepliesByJobIdJson(
      company_id,
      job_id,
      query,
    );
  }
}
