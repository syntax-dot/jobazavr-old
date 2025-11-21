import {
  Controller,
  HttpStatus,
  Headers,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { editFileName } from '../../utils/fileUpload.utils';
import { ParserService } from './parser.service';
import { UserDataDto } from 'src/dto/user-data.dto';

@ApiTags('Работа с парсером')
@Controller('parser')
export class ParserController {
  constructor(private readonly uploadsService: ParserService) {}

  @ApiOperation({
    summary:
      'Загрузка файла для парсинга на бэкенд. Принимаются форматы: xlsx.',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
    }),
  )
  async upload(
    @Headers('user') user: UserDataDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1000 * 1000 * 20,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<boolean> {
    return this.uploadsService.parse(file, user);
  }
}
