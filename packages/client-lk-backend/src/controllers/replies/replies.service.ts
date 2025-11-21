import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Jobs } from 'src/entities/jobs.entity';
import Errors from 'src/errors.enum';
import errorGenerator from 'src/utils/errorGenerator.utils';
import internalAPIRequest from 'src/utils/internalAPIRequest.utils';
import { Repository } from 'typeorm';
import { RepliesQueryGetDto } from './dto/replies-query.dto';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Jobs)
    private readonly jobsRepository: Repository<Jobs>,
  ) {}

  async getRepliesByJobId(
    user: UserDataDto,
    job_id: number,
    query: RepliesQueryGetDto,
  ): Promise<string> {
    if (!user.is_admin && query.company_id)
      errorGenerator(Errors.ACCESS_DENIED);

    const job = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['jobs.id as id'])
      .where('jobs.id = :id', { id: job_id })
      .andWhere('jobs.created_by = :created_by', {
        created_by: query?.company_id ? query.company_id : user.id,
      })
      .getRawOne();

    if (!job) errorGenerator(Errors.NOT_FOUND);

    const getUrl = await internalAPIRequest(
      `replies/${
        query?.company_id ? query.company_id : user.id
      }/${job_id}?period=360`,
      'POST',
    );

    if (getUrl) return getUrl;

    errorGenerator(Errors.WAIT_FOR_SYNC);
  }

  async getRepliesByJobIdJson(
    user: UserDataDto,
    job_id: number,
    query: RepliesQueryGetDto,
  ): Promise<string> {
    if (!user.is_admin && query.company_id)
      errorGenerator(Errors.ACCESS_DENIED);

    const job = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['jobs.id as id'])
      .where('jobs.id = :id', { id: job_id })
      .andWhere('jobs.created_by = :created_by', {
        created_by: query?.company_id ? query.company_id : user.id,
      })
      .getRawOne();

    if (!job) errorGenerator(Errors.NOT_FOUND);

    const getUrl = await internalAPIRequest(
      `replies/${
        query?.company_id ? query.company_id : user.id
      }/${job_id}/json?period=360`,
      'POST',
    );

    if (getUrl) return getUrl;

    errorGenerator(Errors.WAIT_FOR_SYNC);
  }
}
