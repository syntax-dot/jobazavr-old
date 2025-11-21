import { Controller, Headers, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RepliesService } from './replies.service';
import { UserDataDto } from 'src/dto/user-data.dto';
import { RepliesQueryGetDto } from './dto/replies-query.dto';

@ApiTags('Отклики')
@Controller('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Get('/:job_id')
  @ApiOperation({
    summary: 'Получение откликов по ID вакансии',
  })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async getRepliesByJobId(
    @Headers('user') user: UserDataDto,
    @Param('job_id') job_id: number,
    @Query() query: RepliesQueryGetDto,
  ): Promise<string> {
    return await this.repliesService.getRepliesByJobId(user, job_id, query);
  }

  @Get('/:job_id/json')
  @ApiOperation({
    summary: 'Получение откликов по ID вакансии',
  })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async getRepliesByJobIdJson(
    @Headers('user') user: UserDataDto,
    @Param('job_id') job_id: number,
    @Query() query: RepliesQueryGetDto,
  ): Promise<string> {
    return await this.repliesService.getRepliesByJobIdJson(user, job_id, query);
  }
}
