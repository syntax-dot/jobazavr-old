import { Module } from '@nestjs/common';
import { StatisticsModule } from './statistics/statistics.module';
import { RepliesModule } from './replies/replies.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [StatisticsModule, RepliesModule, JobsModule],
})
export class InternalModule {}
