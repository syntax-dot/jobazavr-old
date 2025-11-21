import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { editFileName } from '../../../utils/fileUpload.utils';
import { ParserService } from './parser.service';

@ApiTags('Админ-панель: Работа с парсером')
@Controller('admin/parser')
export class ParserController {
  constructor(private readonly uploadsService: ParserService) {}

  @ApiOperation({
    summary: 'Загрузка фотографий на бэкенд. Принимаются форматы: xlsx.',
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
    return this.uploadsService.parse(file);
  }
}
