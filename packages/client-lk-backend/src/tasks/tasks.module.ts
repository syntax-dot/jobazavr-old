import { Module } from '@nestjs/common';
import { JobsParserModule } from './jobs-parser/jobs-parser.module';
import { SyncModule } from './sync/sync.module';

@Module({
  imports: [JobsParserModule, SyncModule],
})
export class TasksModule {}
