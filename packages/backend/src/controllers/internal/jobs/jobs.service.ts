import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobsFavorites } from 'src/entities/jobs-favorites.entity';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { JobsSubscriptions } from 'src/entities/jobs-subscriptions.entity';
import { Jobs } from 'src/entities/jobs.entity';
import Errors from 'src/errors.enum';
import errorGenerator from 'src/utils/errorGenerator.utils';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { Repository } from 'typeorm';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Jobs)
    private readonly jobsRepository: Repository<Jobs>,

    @InjectRepository(JobsSubscriptions)
    private readonly jobsSubscriptionsRepository: Repository<JobsSubscriptions>,

    @InjectRepository(JobsFavorites)
    private readonly jobsFavoritesRepository: Repository<JobsFavorites>,

    @InjectRepository(JobsResponses)
    private readonly jobsResponsesRepository: Repository<JobsResponses>,
  ) {}

  async deleteJob(company_id: number, job_id: number): Promise<boolean> {
    const findJob = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['jobs.id as id', 'jobs.external_job_id as external_job_id'])
      .where('jobs.external_company_id = :company_id', { company_id })
      .andWhere('jobs.external_job_id = :job_id', { job_id })
      .getRawOne();

    if (!findJob) errorGenerator(Errors.JOB_NOT_FOUND);

    await this.jobsResponsesRepository
      .createQueryBuilder('jobs_responses')
      .delete()
      .where('jobs_responses.job_id = :job_id', { job_id: findJob.id })
      .execute();

    await this.jobsFavoritesRepository
      .createQueryBuilder('jobs_favorites')
      .delete()
      .where('jobs_favorites.job_id = :job_id', { job_id: findJob.id })
      .execute();

    await this.jobsSubscriptionsRepository
      .createQueryBuilder('jobs_subscriptions')
      .delete()
      .where('jobs_subscriptions.job_id = :job_id', { job_id: findJob.id })
      .execute();

    await this.jobsRepository
      .createQueryBuilder('jobs')
      .delete()
      .where('jobs.id = :job_id', { job_id: findJob.id })
      .execute();

    return true;
  }

  async createJobs(company_id: number, jobs): Promise<boolean> {
    const findCompanyJobs = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['*'])
      .where('jobs.external_company_id = :company_id', { company_id })
      .getRawMany();

    const notFoundJobs = findCompanyJobs.filter(
      (findJob) => !jobs.find((job) => job.id === findJob.external_job_id),
    );

    const notFoundJobsIds = notFoundJobs.map((job) => job.id);

    if (notFoundJobsIds.length) {
      await this.jobsResponsesRepository
        .createQueryBuilder('jobs_responses')
        .delete()
        .where('jobs_responses.job_id IN (:...jobIds)', {
          jobIds: notFoundJobsIds,
        })
        .execute();

      await this.jobsFavoritesRepository
        .createQueryBuilder('jobs_favorites')
        .delete()
        .where('jobs_favorites.job_id IN (:...jobIds)', {
          jobIds: notFoundJobsIds,
        })
        .execute();

      await this.jobsSubscriptionsRepository
        .createQueryBuilder('jobs_subscriptions')
        .delete()
        .where('jobs_subscriptions.job_id IN (:...jobIds)', {
          jobIds: notFoundJobsIds,
        })
        .execute();

      await this.jobsRepository
        .createQueryBuilder('jobs')
        .delete()
        .where('jobs.external_company_id = :company_id', { company_id })
        .execute();
    }

    for await (const job of jobs) {
      const findJob = findCompanyJobs.find(
        (findJob) => findJob.external_job_id === job.id,
      );

      if (
        findJob.title !== job.title ||
        findJob.description !== job.description ||
        findJob.address !== job.address ||
        findJob.latitude !== job.latitude ||
        findJob.longitude !== job.longitude ||
        findJob.terms !== job.terms ||
        findJob.salary !== job.salary ||
        findJob.city_id !== job.city_id
      ) {
        await this.jobsRepository
          .createQueryBuilder('jobs')
          .update()
          .set({
            external_company_id: company_id,
            external_job_id: job.id,
            title: job.title,
            description: job.description,
            address: job.address,
            latitude: job.latitude,
            longitude: job.longitude,
            terms: job.terms,
            salary: job.salary,
            city_id: job.city_id,
          })
          .where('jobs.external_job_id = :job_id', { job_id: job.id })
          .execute();
      }

      if (!findJob) {
        await this.jobsRepository
          .createQueryBuilder('jobs')
          .insert()
          .values({
            external_company_id: company_id,
            external_job_id: job.id,
            title: job.title,
            description: job.description,
            address: job.address,
            latitude: job.latitude,
            longitude: job.longitude,
            terms: job.terms,
            salary: job.salary,
            city_id: job.city_id,
            created_at: getCurrentTimestamp(),
          })
          .execute();
      }
    }

    return true;
  }
}
