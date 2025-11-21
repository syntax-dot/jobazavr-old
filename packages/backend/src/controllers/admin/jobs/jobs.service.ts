import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobs } from 'src/entities/jobs.entity';
import { Repository } from 'typeorm';
import { AdminJobsDelete, AdminJobsPatchBody } from './dto/jobs-body.dto';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';
import { Cities } from 'src/entities/cities.entity';
import axios from 'axios';
import * as xl from 'excel4node';
import * as fs from 'fs';
import { JobsFavorites } from 'src/entities/jobs-favorites.entity';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { JobsViews } from 'src/entities/jobs-views.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Jobs)
    private readonly jobsRepository: Repository<Jobs>,

    @InjectRepository(Cities)
    private readonly citiesRepository: Repository<Cities>,

    @InjectRepository(JobsFavorites)
    private readonly jobsFavoritesRepository: Repository<JobsFavorites>,

    @InjectRepository(JobsResponses)
    private readonly jobsResponsesRepository: Repository<JobsResponses>,

    @InjectRepository(JobsViews)
    private readonly jobsViewRepository: Repository<JobsViews>,
  ) {}

  async updateJob(job_id: number, body: AdminJobsPatchBody): Promise<boolean> {
    const findJob = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['jobs.id as id', 'jobs.city_id as city_id'])
      .where('jobs.id = :job_id', { job_id })
      .getRawOne();

    if (!findJob) errorGenerator(Errors.NOT_FOUND);

    if ((body.address && !body.city_id) || (!body.address && body.city_id))
      errorGenerator(Errors.PROVIDE_CITY_AND_ADDRESS);

    const findCity = await this.citiesRepository
      .createQueryBuilder('cities')
      .select(['cities.id as id', 'cities.title as title'])
      .where('cities.id = :city_id', {
        city_id: body.city_id ? body.city_id : findJob.city_id,
      })
      .getRawOne();

    if (!findCity) errorGenerator(Errors.CITY_NOT_FOUND);

    if (body.address) {
      const address = await axios.get(
        `https://catalog.api.2gis.ru/3.0/items?key=demo&q=${encodeURIComponent(
          `${findCity.title}, ${body.address}`,
        )}&fields=items.locale,items.point,items.flags,search_attributes,items.city_alias,items.region_id,items.segment_id,items.reviews,items.point,request_type,context_rubrics,query_context,items.links,items.name_ex,items.name_back,items.org,items.group,items.external_content,items.comment,items.ads.options,items.email_for_sending.allowed,items.stat,items.description,items.geometry.centroid,items.geometry.selection,items.geometry.style,items.timezone_offset,items.context,items.address,items.is_paid,items.access,items.access_comment,items.for_trucks,items.is_incentive,items.paving_type,items.capacity,items.schedule,items.floors,dym,ad,items.rubrics,items.routes,items.reply_rate,items.purpose,items.attribute_groups,items.route_logo,items.has_goods,items.has_apartments_info,items.has_pinned_goods,items.has_realty,items.has_payments,items.is_promoted,items.delivery,items.order_with_cart,search_type,items.has_discount,items.metarubrics,broadcast,items.detailed_subtype,items.temporary_unavailable_atm_services,items.poi_category,filters,widgets&type=adm_div.city,adm_div.district,adm_div.district_area,adm_div.division,adm_div.living_area,adm_div.place,adm_div.region,adm_div.settlement,attraction,branch,building,crossroad,foreign_city,gate,parking,road,route,station,street,coordinates,kilometer_road_sign&page_size=12&page=1&locale=ru_RU&allow_deleted=true&search_device_type=desktop&search_user_hash=7149010526544356454&viewpoint1=30.393263096758304,59.740407046012564&viewpoint2=30.39737677567593,59.73702696470926&stat[sid]=d0863f49-84df-4a62-b597-60333d8b7566&stat[user]=fd4b2c6c-c951-4b89-a40c-8b03e74fe7be&shv=2023-03-31-17&r=1135180620&utm_referrer=&fa821dba_ipp_key=v1680510225985%2fv33947245ba5adc7a72e272%2ff56PoAzzh8t5cw6E%2fQkqDg%3d%3d&fa821dba_ipp_uid=1680510225983%2fDtX59H4Evwx5HmxK%2fyzTSRWEuAYSPtWkUmdUurQ%3d%3d`,
      );

      if (
        address?.data &&
        address?.data?.result &&
        address?.data?.result?.items?.length
      ) {
        body.latitude = address.data.result.items[0].point.lat;
        body.longitude = address.data.result.items[0].point.lon;
        body.address = address.data.result.items[0].full_name;
      } else {
        errorGenerator(Errors.ADDRESS_NOT_FOUND);
      }
    }

    if (Object.keys(body).length === 0) errorGenerator(Errors.BAD_REQUEST);

    await this.jobsRepository
      .createQueryBuilder('jobs')
      .update(Jobs)
      .set(body)
      .where('jobs.id = :job_id', { job_id })
      .execute();

    return true;
  }

  async deleteJob(job_id: number): Promise<boolean> {
    const findJob = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['jobs.id as id', 'jobs.city_id as city_id'])
      .where('jobs.id = :job_id', { job_id })
      .getRawOne();

    if (!findJob) errorGenerator(Errors.NOT_FOUND);

    await this.jobsFavoritesRepository
      .createQueryBuilder('jobs_favorites')
      .delete()
      .where('jobs_favorites.job_id = :job_id', { job_id })
      .execute();

    await this.jobsResponsesRepository
      .createQueryBuilder('jobs_responses')
      .delete()
      .where('jobs_responses.job_id = :job_id', { job_id })
      .execute();

    await this.jobsViewRepository
      .createQueryBuilder('jobs_views')
      .delete()
      .where('jobs_views.job_id = :job_id', { job_id })
      .execute();

    await this.jobsRepository
      .createQueryBuilder('jobs')
      .delete()
      .where('jobs.id = :job_id', { job_id })
      .execute();

    return true;
  }

  async deleteJobByName(body: AdminJobsDelete): Promise<boolean> {
    const findJobs = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select(['jobs.id as id'])
      .where('jobs.title = :title', { title: body.title })
      .getRawMany();

    if (!findJobs.length) errorGenerator(Errors.NOT_FOUND);

    const ids = findJobs.map((el) => el.id);

    await this.jobsFavoritesRepository
      .createQueryBuilder('jobs_favorites')
      .delete()
      .where('jobs_favorites.job_id IN (:...ids)', { ids })
      .execute();

    await this.jobsResponsesRepository
      .createQueryBuilder('jobs_responses')
      .delete()
      .where('jobs_responses.job_id IN (:...ids)', { ids })
      .execute();

    await this.jobsViewRepository
      .createQueryBuilder('jobs_views')
      .delete()
      .where('jobs_views.job_id IN (:...ids)', { ids })
      .execute();

    await this.jobsRepository
      .createQueryBuilder('jobs')
      .delete()
      .where('jobs.id IN (:...ids)', { ids })
      .execute();

    return true;
  }

  async exportJobs(): Promise<any> {
    try {
      fs.unlinkSync(`${process.env.PWD}/static/export.xlsx`);
    } catch {}

    const allJobs = await this.jobsRepository
      .createQueryBuilder('jobs')
      .select([
        'jobs.id as id',
        'cities.title as city',
        'jobs.address as address',
        'jobs.title as title',
        'jobs.description as description',
        'jobs.terms as terms',
        'jobs.salary as salary',
      ])
      .innerJoin('jobs.city_id', 'cities')
      .getRawMany();

    const wb = new xl.Workbook();

    const ws = wb.addWorksheet('Выгрузка вакансий');

    const style = wb.createStyle({
      font: {
        color: '#000000',
        size: 14,
        bold: true,
        center: true,
      },
      alignment: {
        shrinkToFit: false,
        wrapText: true,
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    const defaultStyle = wb.createStyle({
      font: {
        color: '#000000',
        size: 12,
      },
      margin: {
        top: 10,
      },
      alignment: {
        shrinkToFit: false,
        wrapText: true,
      },
      width: 100,
    });

    ws.cell(1, 1).string('ID').style(style);
    ws.cell(1, 2).string('Город').style(style);
    ws.cell(1, 3).string('Название магазина').style(style);
    ws.cell(1, 4).string('Адрес магазина').style(style);
    ws.cell(1, 5).string('Должность').style(style);
    ws.cell(1, 6).string('Зарплата').style(style);
    ws.cell(1, 7).string('Режим работы (расшифровка)').style(style);
    ws.cell(1, 8).string('Обязанности').style(style);

    ws.column(2).setWidth(25);
    ws.column(3).setWidth(25);
    ws.column(4).setWidth(50);
    ws.column(5).setWidth(30);
    ws.column(7).setWidth(50);
    ws.column(8).setWidth(50);

    let key = 1;

    for await (const el of allJobs) {
      ws.cell(key + 1, 1)
        .string(String(el.id))
        .style(defaultStyle);
      ws.cell(key + 1, 2)
        .string(el.city)
        .style(defaultStyle);
      ws.cell(key + 1, 3)
        .string(el.title)
        .style(defaultStyle);
      ws.cell(key + 1, 4)
        .string(el.address)
        .style(defaultStyle);
      ws.cell(key + 1, 5)
        .string(el.description)
        .style(defaultStyle);
      ws.cell(key + 1, 6)
        .string(el.salary)
        .style(defaultStyle);
      ws.cell(key + 1, 7)
        .string(el.terms)
        .style(defaultStyle);
      ws.cell(key + 1, 8)
        .string(el.terms)
        .style(defaultStyle);
      key++;
    }

    wb.write(`${process.env.PWD}/static/export.xlsx`);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return `${process.env.FILES_URL}/export.xlsx`;
  }
}
