import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as appRoot from 'app-root-path';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { UploadedFiles } from 'src/entities/uploaded-files.entity';

@Injectable()
export class ParserService {
  constructor(
    @InjectRepository(UploadedFiles)
    private readonly uploadedFilesRepository: Repository<UploadedFiles>,
  ) {}

  async parse(file: Express.Multer.File): Promise<boolean> {
    await this.uploadedFilesRepository
      .createQueryBuilder()
      .insert()
      .into(UploadedFiles)
      .values({
        path: `${appRoot}/${file.path}`,
        created_at: getCurrentTimestamp(),
      })
      .execute();

    return true;
  }
}
