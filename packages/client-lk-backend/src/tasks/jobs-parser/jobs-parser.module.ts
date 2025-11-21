import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from 'src/entities/cities.entity';
import { Jobs } from 'src/entities/jobs.entity';
import { UploadedFiles } from 'src/entities/uploaded-files.entity';
import { JobsParserService } from './jobs-parser.service';
import { SyncQueue } from 'src/entities/sync-queue.entity';

@Module({
  providers: [JobsParserService],
  imports: [TypeOrmModule.forFeature([Jobs, UploadedFiles, SyncQueue, Cities])],
})
export class JobsParserModule {}
