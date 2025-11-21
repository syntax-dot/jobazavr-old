import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Devices } from 'src/entities/devices.entity';
import { JobsSubscriptions } from 'src/entities/jobs-subscriptions.entity';
import { Jobs } from 'src/entities/jobs.entity';
import { Repository } from 'typeorm';
import { SubscriptionsBody } from './dto/subscriptions-body.dto';
import { CreateDataDto } from 'src/dto/create-data.dto';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';
import Redis from 'ioredis';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { SubscriptionsData } from './dto/subscriptions-data.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Jobs)
    private readonly jobsRepository: Repository<Jobs>,

    @InjectRepository(JobsSubscriptions)
    private readonly jobsSubscriptionsRepository: Repository<JobsSubscriptions>,

    @InjectRepository(Devices)
    private readonly devicesRepository: Repository<Devices>,

    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async getSubscriptions(user: UserDataDto): Promise<SubscriptionsData[]> {
    const cachedData = await this.redis.get(`subscriptions:${user.id}`);

    if (cachedData) return JSON.parse(cachedData);

    const data = await this.jobsSubscriptionsRepository
      .createQueryBuilder('jobs_subscriptions')
      .select([
        'jobs_subscriptions.id as id',
        'jobs_subscriptions.title as title',
      ])
      .where('jobs_subscriptions.created_by = :id', { id: user.id })
      .getRawMany();

    await this.redis.set(
      `subscriptions:${user.id}`,
      JSON.stringify(data),
      'EX',
      300,
    );

    return data;
  }

  async subscribe(
    user: UserDataDto,
    body: SubscriptionsBody,
  ): Promise<CreateDataDto> {
    if (!user?.notifications) {
      const findDevices = await this.devicesRepository
        .createQueryBuilder('devices')
        .select(['devices.id as id'])
        .where('devices.created_by = :id', { id: user.id })
        .getRawMany();

      if (!findDevices.length) errorGenerator(Errors.NOTIFICATIONS_DISABLED);
    }

    const findDuplicate = await this.jobsSubscriptionsRepository
      .createQueryBuilder('jobs_subscriptions')
      .select(['jobs_subscriptions.id as id'])
      .where('jobs_subscriptions.created_by = :id', { id: user.id })
      .andWhere('jobs_subscriptions.title = :title', { title: body.employer })
      .getRawOne();

    if (findDuplicate) errorGenerator(Errors.ALREADY_EXISTS);

    const findEmployer = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['jobs.id as id'])
      .where('jobs.title = :title', { title: body.employer })
      .getRawOne();

    if (!findEmployer) errorGenerator(Errors.NOT_FOUND);

    const insertData = await this.jobsSubscriptionsRepository
      .createQueryBuilder('jobs_subscriptions')
      .insert()
      .into(JobsSubscriptions)
      .values({
        title: body.employer,
        created_by: user.id,
        created_at: getCurrentTimestamp(),
      })
      .execute();

    await this.redis.del(`subscriptions:${user.id}`);

    return { id: insertData.identifiers[0].id };
  }

  async unsubscribe(user: UserDataDto, id: number): Promise<boolean> {
    const findSubscription = await this.jobsSubscriptionsRepository
      .createQueryBuilder('jobs_subscriptions')
      .select(['jobs_subscriptions.id as id'])
      .where('jobs_subscriptions.id = :id', { id })
      .getRawOne();

    if (!findSubscription) errorGenerator(Errors.NOT_FOUND);

    await this.jobsSubscriptionsRepository
      .createQueryBuilder()
      .delete()
      .from(JobsSubscriptions)
      .where('id = :id', { id })
      .execute();

    await this.redis.del(`subscriptions:${user.id}`);

    return true;
  }
}
