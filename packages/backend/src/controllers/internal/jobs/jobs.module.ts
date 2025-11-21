import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsFavorites } from 'src/entities/jobs-favorites.entity';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { JobsSubscriptions } from 'src/entities/jobs-subscriptions.entity';
import { Jobs } from 'src/entities/jobs.entity';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [
    TypeOrmModule.forFeature([
      Jobs,
      JobsResponses,
      JobsFavorites,
      JobsSubscriptions,
    ]),
  ],
})
export class JobsModule {}
