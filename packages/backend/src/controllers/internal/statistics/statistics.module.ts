import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from 'src/entities/jobs.entity';
import { JobsViews } from 'src/entities/jobs-views.entity';
import { JobsResponses } from 'src/entities/jobs-responses.entity';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [TypeOrmModule.forFeature([Jobs, JobsViews, JobsResponses])],
})
export class StatisticsModule {}
