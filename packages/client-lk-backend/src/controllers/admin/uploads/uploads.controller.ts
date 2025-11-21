import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { AdminUploadsUserData } from './dto/uploads-data.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadsData } from 'src/controllers/uploads/dto/upload-data.dto';
import { UploadQueryDto } from 'src/controllers/uploads/dto/upload-query.dto';
import { editFileName } from 'src/utils/fileUpload.utils';

@ApiTags('Админ-панель: Модуль управления загрузками')
@Controller('admin/uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get('/:company_id')
  @ApiOperation({
    summary:
      'Получение списка загруженных файлов по компании (финансовый блок).',
  })
  @ApiResponse({
    status: 200,
    type: AdminUploadsUserData,
    isArray: true,
  })
  async getUploads(
    @Param('company_id') company_id: number,
  ): Promise<AdminUploadsUserData[]> {
    return await this.uploadsService.getUploads(company_id);
  }

  @ApiOperation({
    summary: 'Загрузка файлов на бэкенд (финансовый блок).',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @Post('/:company_id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
    }),
  )
  async upload(
    @Param('company_id') company_id: number,
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
    return this.uploadsService.upload(company_id, file, query);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Удаление файла (финансовый блок).',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async deleteUpload(@Param('id') id: number): Promise<boolean> {
    return await this.uploadsService.deleteUpload(id);
  }
}
