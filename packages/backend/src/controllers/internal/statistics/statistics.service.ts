import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { JobsViews } from 'src/entities/jobs-views.entity';
import { Jobs } from 'src/entities/jobs.entity';
import Errors from 'src/errors.enum';
import errorGenerator from 'src/utils/errorGenerator.utils';
import { Repository } from 'typeorm';
import { StatisticsData } from './dto/statistics-data.dto';
import { StatisticsQueryDto } from './dto/statistics-query.dto';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Jobs)
    private readonly jobsRepository: Repository<Jobs>,

    @InjectRepository(JobsViews)
    private readonly jobsViewsRepository: Repository<JobsViews>,

    @InjectRepository(JobsResponses)
    private readonly jobsResponsesRepository: Repository<JobsResponses>,
  ) {}

  async getStatisticsByCompanyId(
    company_id: number,
  ): Promise<StatisticsData[]> {
    const findCompanyJobs = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['jobs.id as id', 'jobs.external_job_id as external_job_id'])
      .where('jobs.external_company_id = :company_id', { company_id })
      .getRawMany();

    if (!findCompanyJobs.length) errorGenerator(Errors.COMPANY_NOT_FOUND);

    const jobIds = findCompanyJobs.map((job) => job.id);

    const findJobsViews = await this.jobsViewsRepository
      .createQueryBuilder('jobs_views')
      .select(['jobs_views.job_id as job_id'])
      .where('jobs_views.job_id IN (:...jobIds)', { jobIds })
      .getRawMany();

    const jobsViews = findJobsViews.map((job) => job.job_id);

    const findJobsResponses = await this.jobsResponsesRepository
      .createQueryBuilder('jobs_responses')
      .select(['jobs_responses.job_id as job_id'])
      .where('jobs_responses.job_id IN (:...jobIds)', { jobIds })
      .getRawMany();

    const jobsResponses = findJobsResponses.map((job) => job.job_id);

    const statistics = findCompanyJobs.map((job) => {
      const views = jobsViews.filter((view) => view === job.id).length;
      const replies = jobsResponses.filter(
        (response) => response === job.id,
      ).length;

      return {
        id: job.external_job_id,
        views,
        replies,
      };
    });

    return statistics;
  }

  async getStatisticsByJobId(
    company_id: number,
    job_id: number,
    query: StatisticsQueryDto,
  ): Promise<StatisticsData> {
    const findJob = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['jobs.id as id', 'jobs.external_job_id as external_job_id'])
      .where('jobs.external_company_id = :company_id', { company_id })
      .andWhere('jobs.external_job_id = :job_id', { job_id })
      .getRawOne();

    if (!findJob) errorGenerator(Errors.JOB_NOT_FOUND);

    const periodFrom = getCurrentTimestamp() - query.period * 86400;
    const periodTo = getCurrentTimestamp();

    const findJobViews = await this.jobsViewsRepository
      .createQueryBuilder('jobs_views')
      .select(['jobs_views.id as id'])
      .where('jobs_views.job_id = :job_id', { job_id: findJob.id })
      .andWhere('jobs_views.viewed_at >= :periodFrom', { periodFrom })
      .andWhere('jobs_views.viewed_at <= :periodTo', { periodTo })
      .getRawMany();

    const views = findJobViews.length;

    const findJobResponses = await this.jobsResponsesRepository
      .createQueryBuilder('jobs_responses')
      .select(['jobs_responses.id as id'])
      .where('jobs_responses.job_id = :job_id', { job_id: findJob.id })
      .andWhere('jobs_responses.created_at >= :periodFrom', { periodFrom })
      .andWhere('jobs_responses.created_at <= :periodTo', { periodTo })
      .getRawMany();

    const replies = findJobResponses.length;

    return {
      id: findJob.external_job_id,
      views,
      replies,
    };
  }
}
