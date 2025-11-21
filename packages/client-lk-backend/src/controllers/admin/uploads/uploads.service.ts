import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Uploads } from 'src/entities/uploads.entity';
import { Users } from 'src/entities/users.entity';
import Errors from 'src/errors.enum';
import errorGenerator from 'src/utils/errorGenerator.utils';
import { Repository } from 'typeorm';
import { AdminUploadsUserData } from './dto/uploads-data.dto';
import { UploadsData } from 'src/controllers/uploads/dto/upload-data.dto';
import { UploadQueryDto } from 'src/controllers/uploads/dto/upload-query.dto';
import * as appRoot from 'app-root-path';
import uploadFile from 'src/utils/uploadFile.utils';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Uploads)
    private readonly uploadsRepository: Repository<Uploads>,
  ) {}

  async getUploads(company_id: number): Promise<AdminUploadsUserData[]> {
    const findCompany = await this.usersRepository
      .createQueryBuilder('users')
      .select(['users.id as id'])
      .where('users.id = :id', { id: company_id })
      .getRawOne();

    if (!findCompany) errorGenerator(Errors.NOT_FOUND);

    const uploads = await this.uploadsRepository
      .createQueryBuilder('uploads')
      .select([
        'uploads.id as id',
        'uploads.type as type',
        'uploads.url as url',
        'uploads.uploaded_at as uploaded_at',
      ])
      .where('uploads.uploaded_by = :uploaded_by', {
        uploaded_by: company_id,
      })
      .getRawMany();

    return uploads.map((upload) => ({
      ...upload,
      file_name: upload.url.split('/')[upload.url.split('/').length - 1],
    }));
  }

  async upload(
    company_id: number,
    file: Express.Multer.File,
    query: UploadQueryDto,
  ): Promise<UploadsData> {
    return await uploadFile(
      company_id,
      `${appRoot}/${file.path}`,
      file.mimetype.split('/')[1],
      this.uploadsRepository,
      query.type,
    );
  }

  async deleteUpload(id: number): Promise<boolean> {
    const upload = await this.uploadsRepository
      .createQueryBuilder('uploads')
      .where('uploads.id = :id', { id })
      .getOne();

    if (!upload) errorGenerator(Errors.NOT_FOUND);

    await this.uploadsRepository
      .createQueryBuilder('uploads')
      .delete()
      .where('uploads.id = :id', { id })
      .execute();

    return true;
  }
}
