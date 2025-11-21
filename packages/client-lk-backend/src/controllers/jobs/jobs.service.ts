import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Cities } from 'src/entities/cities.entity';
import { Jobs } from 'src/entities/jobs.entity';
import Errors from 'src/errors.enum';
import errorGenerator from 'src/utils/errorGenerator.utils';
import { Repository } from 'typeorm';
import { JobsData } from './dto/jobs-data.dto';
import { JobsQueryDeleteDto, JobsQueryGetDto } from './dto/jobs-query.dto';
import internalAPIRequest from 'src/utils/internalAPIRequest.utils';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Jobs)
    private readonly jobsRepository: Repository<Jobs>,

    @InjectRepository(Cities)
    private readonly citiesRepository: Repository<Cities>,
  ) {}

  async getJobsById(
    id: number,
    user: UserDataDto,
    query: JobsQueryGetDto,
  ): Promise<JobsData> {
    if (!user.is_admin && query.company_id)
      errorGenerator(Errors.ACCESS_DENIED);

    const job = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select([
        'jobs.id as id',
        'jobs.title as title',
        'jobs.description as description',
        'jobs.address as address',
        'jobs.salary as salary',
        'jobs.latitude as latitude',
        'jobs.longitude as longitude',
        'jobs.terms as terms',
      ])
      .where('jobs.id = :id', { id })
      .andWhere('jobs.created_by = :created_by', {
        created_by: query?.company_id ? query.company_id : user.id,
      })
      .getRawOne();

    if (!job) errorGenerator(Errors.NOT_FOUND);

    const statistics = await internalAPIRequest(
      `statistics/${
        query?.company_id ? query.company_id : user.id
      }/${id}?period=${query?.period || 360}`,
      'GET',
    );

    if (statistics) {
      job.views = statistics.views;
      job.replies = statistics.replies;
    }

    return job;
  }

  async getJobsByCity(
    id: number,
    query: JobsQueryGetDto,
    user: UserDataDto,
  ): Promise<JobsData[]> {
    if (!user.is_admin && query.company_id)
      errorGenerator(Errors.ACCESS_DENIED);

    const findCity = await this.citiesRepository
      .createQueryBuilder('cities')
      .where('cities.id = :id', { id })
      .getRawOne();

    if (!findCity) errorGenerator(Errors.CITY_NOT_FOUND);

    const jobs = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select([
        'jobs.id as id',
        'jobs.title as title',
        'jobs.description as description',
        'jobs.address as address',
        'jobs.salary as salary',
        'jobs.latitude as latitude',
        'jobs.longitude as longitude',
        'jobs.terms as terms',
      ])
      .where('jobs.city_id = :id', { id })
      .andWhere('jobs.created_by = :created_by', {
        created_by: query?.company_id ? query.company_id : user.id,
      })
      .limit(query.limit || 25)
      .offset(query.offset || 0)
      .getRawMany();

    const statistics = await internalAPIRequest(
      `statistics/${query?.company_id ? query.company_id : user.id}`,
      'GET',
    );

    jobs.forEach((job) => {
      const findStat = statistics?.find((stat) => stat.id === job.id);

      if (findStat) {
        job.views = findStat.views;
        job.replies = findStat.replies;
      }
    });

    return jobs;
  }

  async getJobs(
    query: JobsQueryGetDto,
    user: UserDataDto,
  ): Promise<JobsData[]> {
    if (!user.is_admin && query.company_id)
      errorGenerator(Errors.ACCESS_DENIED);

    const jobs = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select([
        'jobs.id as id',
        'jobs.title as title',
        'jobs.description as description',
        'jobs.address as address',
        'jobs.salary as salary',
        'jobs.city_id as city_id',
        'jobs.latitude as latitude',
        'jobs.longitude as longitude',
        'jobs.terms as terms',
      ])
      .where('jobs.created_by = :created_by', {
        created_by: query?.company_id ? query.company_id : user.id,
      })
      .orderBy('jobs.id', 'DESC')
      .limit(query.limit || 100)
      .offset(query.offset || 0)
      .getRawMany();

    const statistics = await internalAPIRequest(
      `statistics/${query?.company_id ? query.company_id : user.id}`,
      'GET',
    );

    if (statistics?.length)
      jobs.forEach((job) => {
        const findStat = statistics.find((stat) => stat.id === job.id);

        if (findStat) {
          job.views = findStat.views;
          job.replies = findStat.replies;
        }
      });

    return jobs;
  }

  async deleteJobsById(
    id: number,
    user: UserDataDto,
    query: JobsQueryDeleteDto,
  ): Promise<boolean | undefined> {
    if (!user.is_admin && query.company_id)
      errorGenerator(Errors.ACCESS_DENIED);

    const job = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['jobs.id as id'])
      .where('jobs.id = :id', { id })
      .andWhere('jobs.created_by = :created_by', {
        created_by: query?.company_id ? query.company_id : user.id,
      })
      .getRawOne();

    if (!job) errorGenerator(Errors.NOT_FOUND);

    await this.jobsRepository
      .createQueryBuilder()
      .delete()
      .from(Jobs)
      .where('id = :id', { id })
      .andWhere('created_by = :created_by', {
        created_by: query?.company_id ? query.company_id : user.id,
      })
      .execute();

    await internalAPIRequest(
      `jobs/${query?.company_id ? query.company_id : user.id}/${id}`,
      'DELETE',
    );

    return true;
  }
}
