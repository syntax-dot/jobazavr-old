import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { Jobs } from 'src/entities/jobs.entity';
import Errors from 'src/errors.enum';
import errorGenerator from 'src/utils/errorGenerator.utils';
import { Repository } from 'typeorm';
import * as xl from 'excel4node';
import * as fs from 'fs';
import { RepliesQueryDto } from './dto/replies-query.dto';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { ExternalRepliesData } from './dto/replies-data.dto';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Jobs)
    private readonly jobsRepository: Repository<Jobs>,

    @InjectRepository(JobsResponses)
    private readonly jobsResponsesRepository: Repository<JobsResponses>,
  ) {}

  async getRepliesByJobIdJson(
    company_id: number,
    job_id: number,
    query: RepliesQueryDto,
  ): Promise<ExternalRepliesData[]> {
    const findJob = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['jobs.id as id', 'jobs.external_job_id as external_job_id'])
      .where('jobs.external_company_id = :company_id', { company_id })
      .andWhere('jobs.external_job_id = :job_id', { job_id })
      .getRawOne();

    if (!findJob) errorGenerator(Errors.JOB_NOT_FOUND);

    const periodFrom = getCurrentTimestamp() - query.period * 86400;
    const periodTo = getCurrentTimestamp();

    const replies = await this.jobsResponsesRepository
      .createQueryBuilder('jobs_responses')
      .select([
        'jobs_responses.id as id',
        'jobs.address as address',
        'jobs.title as title',
        'jobs.description as description',
        'users.name as name',
        'users.phone as phone',
        'users.age as age',
        'users.platform as platform',
        'users.user_id as user_id',
      ])
      .innerJoin('jobs_responses.job_id', 'jobs')
      .innerJoin('jobs_responses.created_by', 'users')
      .where('jobs_responses.job_id = :job_id', { job_id: findJob.id })
      .andWhere('jobs_responses.created_at >= :periodFrom', {
        periodFrom,
      })
      .andWhere('jobs_responses.created_at <= :periodTo', {
        periodTo,
      })
      .getRawMany();

    return replies;
  }

  async getRepliesByJobId(
    company_id: number,
    job_id: number,
    query: RepliesQueryDto,
  ): Promise<string> {
    const findJob = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['jobs.id as id', 'jobs.external_job_id as external_job_id'])
      .where('jobs.external_company_id = :company_id', { company_id })
      .andWhere('jobs.external_job_id = :job_id', { job_id })
      .getRawOne();

    if (!findJob) errorGenerator(Errors.JOB_NOT_FOUND);

    const periodFrom = getCurrentTimestamp() - query.period * 86400;
    const periodTo = getCurrentTimestamp();

    const replies = await this.jobsResponsesRepository
      .createQueryBuilder('jobs_responses')
      .select([
        'jobs_responses.id as id',
        'jobs.address as address',
        'jobs.title as title',
        'jobs.description as description',
        'users.name as name',
        'users.phone as phone',
        'users.age as age',
        'users.platform as platform',
        'users.user_id as user_id',
      ])
      .innerJoin('jobs_responses.job_id', 'jobs')
      .innerJoin('jobs_responses.created_by', 'users')
      .where('jobs_responses.job_id = :job_id', { job_id: findJob.id })
      .andWhere('jobs_responses.created_at >= :periodFrom', {
        periodFrom,
      })
      .andWhere('jobs_responses.created_at <= :periodTo', {
        periodTo,
      })
      .getRawMany();

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet('Выгрузка из админ-панели');

    const style = wb.createStyle({
      font: {
        color: '#000000',
        size: 14,
        bold: true,
        center: true,
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    const defaultStyle = wb.createStyle({
      font: {
        color: '#000000',
        size: 12,
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    ws.cell(1, 1).string('ID').style(style);
    ws.cell(1, 2).string('Компания').style(style);
    ws.cell(1, 3).string('Вакансия').style(style);
    ws.cell(1, 4).string('Адрес').style(style);
    ws.cell(1, 5).string('Ссылка на страницу').style(style);
    ws.cell(1, 6).string('Имя фамилия').style(style);
    ws.cell(1, 7).string('Возраст').style(style);
    ws.cell(1, 8).string('Телефон').style(style);

    let key = 2;

    for await (const el of replies) {
      ws.cell(key + 1, 1)
        .string(String(el.id))
        .style(defaultStyle);
      ws.cell(key + 1, 2)
        .string(el.title)
        .style(defaultStyle);
      ws.cell(key + 1, 3)
        .string(el.description)
        .style(defaultStyle);
      ws.cell(key + 1, 4)
        .string(el.address)
        .style(defaultStyle);
      ws.cell(key + 1, 5)
        .string(
          el.platform === 'vk'
            ? `vk.com/id${el.user_id}`
            : `web.telegram.org/k/#${el.user_id}`,
        )
        .style(defaultStyle);
      ws.cell(key + 1, 6)
        .string(el.name)
        .style(defaultStyle);
      ws.cell(key + 1, 7)
        .string(String(el.age))
        .style(defaultStyle);
      ws.cell(key + 1, 8)
        .string(el.phone)
        .style(defaultStyle);

      key++;
    }

    try {
      fs.unlinkSync(
        `${process.env.PWD}/static/internal/${company_id}_replies.xlsx`,
      );
    } catch {}

    wb.write(`${process.env.PWD}/static/internal/${company_id}_replies.xlsx`);

    return `${process.env.FILES_URL}/internal/${company_id}_replies.xlsx`;
  }
}
