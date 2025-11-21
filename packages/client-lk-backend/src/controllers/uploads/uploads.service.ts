import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Uploads } from '../../entities/uploads.entity';
// import uploadImage from '../../utils/uploadImage.utils';
import { Repository } from 'typeorm';
import { UploadsData, UploadsUserData } from './dto/upload-data.dto';
import * as appRoot from 'app-root-path';
import { UserDataDto } from 'src/dto/user-data.dto';
import uploadFile from 'src/utils/uploadFile.utils';
import { UploadQueryDto } from './dto/upload-query.dto';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Uploads)
    private readonly uploadsRepository: Repository<Uploads>,
  ) {}

  async getUploads(user: UserDataDto): Promise<UploadsUserData[]> {
    const uploads = await this.uploadsRepository
      .createQueryBuilder('uploads')
      .select([
        'uploads.id as id',
        'uploads.type as type',
        'uploads.url as url',
        'uploads.uploaded_at as uploaded_at',
      ])
      .where('uploads.uploaded_by = :uploaded_by', {
        uploaded_by: user.id,
      })
      .getRawMany();

    return uploads.map((upload) => ({
      ...upload,
      file_name: upload.url.split('/')[upload.url.split('/').length - 1],
    }));
  }

  async upload(
    user: UserDataDto,
    file: Express.Multer.File,
    query: UploadQueryDto,
  ): Promise<UploadsData> {
    return await uploadFile(
      user.id,
      `${appRoot}/${file.path}`,
      file.mimetype.split('/')[1],
      this.uploadsRepository,
      query.type,
    );
  }

  async deleteUpload(id: number, user: UserDataDto): Promise<boolean> {
    const upload = await this.uploadsRepository
      .createQueryBuilder('uploads')
      .where('uploads.id = :id', { id })
      .andWhere('uploads.uploaded_by = :uploaded_by', {
        uploaded_by: user.id,
      })
      .getOne();

    if (!upload) errorGenerator(Errors.NOT_FOUND);

    await this.uploadsRepository
      .createQueryBuilder('uploads')
      .delete()
      .where('uploads.id = :id', { id })
      .andWhere('uploads.uploaded_by = :uploaded_by', {
        uploaded_by: user.id,
      })
      .execute();

    return true;
  }
}
