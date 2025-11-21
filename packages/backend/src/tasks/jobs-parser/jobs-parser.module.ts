import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from 'src/entities/cities.entity';
import { Jobs } from 'src/entities/jobs.entity';
import { UploadedFiles } from 'src/entities/uploaded-files.entity';
import { JobsParserService } from './jobs-parser.service';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { JobsFavorites } from 'src/entities/jobs-favorites.entity';
import { JobsSubscriptions } from 'src/entities/jobs-subscriptions.entity';
import { Devices } from 'src/entities/devices.entity';

@Module({
  providers: [JobsParserService],
  imports: [
    TypeOrmModule.forFeature([
      Jobs,
      UploadedFiles,
      JobsResponses,
      JobsFavorites,
      JobsSubscriptions,
      Devices,
      Cities,
    ]),
  ],
})
export class JobsParserModule {}
