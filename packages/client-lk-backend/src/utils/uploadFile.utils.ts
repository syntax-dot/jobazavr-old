import * as md5 from 'md5-file';
import { Repository } from 'typeorm';
import { Uploads } from 'src/entities/uploads.entity';
import * as fs from 'fs';
import getCurrentTimestamp from './getCurrentTimestamp.utils';
import * as appRoot from 'app-root-path';

interface FileResponse {
  id: number;
  url: string;
}

const uploadFile = async (
  user_id: number,
  path: string,
  type: string,
  uploadsRepository: Repository<Uploads>,
  fileType: string,
): Promise<FileResponse> => {
  // Getting the file hash (md5 hash)
  const hash: string = await md5(path);

  // Checking if the file is already uploaded
  const findUpload = await uploadsRepository
    .createQueryBuilder('uploads')
    .select(['id', 'url'])
    .andWhere('hash = :hash', { hash })
    .getRawOne();

  const fileBuffer = fs.readFileSync(path);

  // If it is, we will return the id, url and the uploaded file will be deleted
  if (findUpload) {
    fs.rmSync(path, {
      force: true,
    });

    return {
      id: findUpload.id,
      url: findUpload.url,
    };
  }

  fs.writeFileSync(`${appRoot}/static/${hash}.${type}`, fileBuffer);

  // Inserting the upload into the database
  const url = `${process.env.FILES_URL}/${hash}.${type}`;

  const insert = await uploadsRepository.insert({
    uploaded_by: user_id,
    hash,
    url,
    type: fileType,
    uploaded_at: getCurrentTimestamp(),
  });

  return {
    id: insert.identifiers[0].id,
    url,
  };
};

export default uploadFile;
