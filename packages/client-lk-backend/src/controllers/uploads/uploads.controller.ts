import {
  Controller,
  Post,
  Headers,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Query,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { diskStorage } from 'multer';
import { editFileName } from '../../utils/fileUpload.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDataDto } from 'src/dto/user-data.dto';
import { UploadsData, UploadsUserData } from './dto/upload-data.dto';
import { UploadQueryDto } from './dto/upload-query.dto';

@ApiTags('Загрузка файлов в финансовый блок')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение списка загруженных файлов (финансовый блок).',
  })
  @ApiResponse({
    status: 200,
    type: UploadsUserData,
    isArray: true,
  })
  async getUploads(
    @Headers('user') user: UserDataDto,
  ): Promise<UploadsUserData[]> {
    return await this.uploadsService.getUploads(user);
  }

  @ApiOperation({
    summary: 'Загрузка файлов на бэкенд (финансовый блок).',
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
    @Query() query: UploadQueryDto,
  ): Promise<UploadsData> {
    return this.uploadsService.upload(user, file, query);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Удаление файла (финансовый блок).',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async deleteUpload(
    @Headers('user') user: UserDataDto,
    @Param('id') param: number,
  ): Promise<boolean> {
    return await this.uploadsService.deleteUpload(param, user);
  }
}
