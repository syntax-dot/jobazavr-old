import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from 'src/entities/jobs.entity';
import { SyncQueue } from 'src/entities/sync-queue.entity';

@Module({
  providers: [SyncService],
  imports: [TypeOrmModule.forFeature([Jobs, SyncQueue])],
})
export class SyncModule {}
