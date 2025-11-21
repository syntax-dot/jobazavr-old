import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { Repository } from 'typeorm';
import * as xl from 'excel4node';
import * as fs from 'fs';
import { UserDataDto } from 'src/dto/user-data.dto';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(JobsResponses)
    private readonly repliesRepository: Repository<JobsResponses>,
  ) {}

  async createReply(user: UserDataDto): Promise<string> {
    const replies = await this.repliesRepository
      .createQueryBuilder('jobs_responses')
      .select([
        'jobs_responses.id as id',
        'jobs.address as address',
        'jobs.title as title',
        'jobs.description as description',
        'users.name as name',
        'users.phone as phone',
        'users.age as age',
        'users.user_id as user_id',
      ])
      .innerJoin('jobs_responses.job_id', 'jobs')
      .innerJoin('jobs_responses.created_by', 'users')
      .where(`users.platform = :platform`, {
        platform: user.platform,
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
          user.platform === 'vk'
            ? `vk.com/id${el.user_id}`
            : `web.telegram.org/k/#${user.user_id}`,
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
      fs.unlinkSync(`${process.env.PWD}/static/replies_${user.user_id}.xlsx`);
    } catch {}

    wb.write(`${process.env.PWD}/static/replies_${user.user_id}.xlsx`);

    return `${process.env.FILES_URL}/replies_${user.user_id}.xlsx`;
  }
}
