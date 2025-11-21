import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobs } from 'src/entities/jobs.entity';
import { SyncQueue } from 'src/entities/sync-queue.entity';
import internalAPIRequest from 'src/utils/internalAPIRequest.utils';
import { Repository } from 'typeorm';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(SyncQueue)
    private syncQueueRepository: Repository<SyncQueue>,

    @InjectRepository(Jobs)
    private jobsRepository: Repository<Jobs>,
  ) {}

  // @Cron('* * * * *')
  async handleSync(): Promise<void> {
    const syncQueue = await this.syncQueueRepository
      .createQueryBuilder('sync_queue')
      .select(['sync_queue.id as id', 'sync_queue.created_by as created_by'])
      .getRawMany();

    for await (const el of syncQueue) {
      await this.syncQueueRepository
        .createQueryBuilder()
        .delete()
        .from(SyncQueue)
        .where('id = :id', { id: el.id })
        .andWhere('created_by = :created_by', {
          created_by: el.created_by,
        })
        .execute();

      const jobs = await this.jobsRepository
        .createQueryBuilder('jobs')
        .select(['*'])
        .where('jobs.created_by = :created_by', { created_by: el.created_by })
        .getRawMany();

      await internalAPIRequest(`jobs/${el.created_by}`, 'PATCH', jobs);
    }
  }
}
