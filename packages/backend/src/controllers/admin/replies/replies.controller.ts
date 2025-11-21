import { Controller, Headers, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDataDto } from 'src/dto/user-data.dto';
import { RepliesService } from './replies.service';

@ApiTags('Админ-панель: Выгрузка откликов')
@Controller('admin/replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post()
  @ApiOperation({
    summary: 'Выгрузка откликов',
  })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async createReply(@Headers('user') user: UserDataDto): Promise<string> {
    return await this.repliesService.createReply(user);
  }
}
