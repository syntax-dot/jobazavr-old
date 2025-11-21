import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from 'src/entities/jobs.entity';
import { Cities } from 'src/entities/cities.entity';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { JobsFavorites } from 'src/entities/jobs-favorites.entity';
import { JobsViews } from 'src/entities/jobs-views.entity';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [
    TypeOrmModule.forFeature([
      Jobs,
      Cities,
      JobsViews,
      JobsResponses,
      JobsFavorites,
    ]),
  ],
})
export class JobsModule {}
