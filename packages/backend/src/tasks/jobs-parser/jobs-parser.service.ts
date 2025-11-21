import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cities } from 'src/entities/cities.entity';
import { Jobs } from 'src/entities/jobs.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import xlsx from 'node-xlsx';
import axios from 'axios';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { UploadedFiles } from 'src/entities/uploaded-files.entity';
import { Cron } from '@nestjs/schedule';
import { JobsFavorites } from 'src/entities/jobs-favorites.entity';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { JobsSubscriptions } from 'src/entities/jobs-subscriptions.entity';
import sendPushNotifications from 'src/utils/sendPushNotifications.utils';
import { Devices } from 'src/entities/devices.entity';

@Injectable()
export class JobsParserService {
  constructor(
    @InjectRepository(Cities)
    private readonly citiesRepository: Repository<Cities>,

    @InjectRepository(Jobs)
    private readonly jobsRepository: Repository<Jobs>,

    @InjectRepository(Devices)
    private readonly devicesRepository: Repository<Devices>,

    @InjectRepository(JobsSubscriptions)
    private readonly jobsSubscriptionsRepository: Repository<JobsSubscriptions>,

    @InjectRepository(UploadedFiles)
    private readonly uploadedFilesRepository: Repository<UploadedFiles>,

    @InjectRepository(JobsFavorites)
    private readonly jobsFavoritesRepository: Repository<JobsFavorites>,

    @InjectRepository(JobsResponses)
    private readonly jobsResponsesRepository: Repository<JobsResponses>,
  ) {}

  @Cron('* * * * *')
  async handleCron(): Promise<void> {
    const findFile = await this.uploadedFilesRepository
      .createQueryBuilder('uploaded_files')
      .select(['uploaded_files.path as path', 'uploaded_files.id as id'])
      .orderBy('uploaded_files.created_at', 'DESC')
      .getRawMany();

    if (!findFile.length) return;

    for await (const el of findFile) {
      await this.uploadedFilesRepository
        .createQueryBuilder()
        .delete()
        .from(UploadedFiles)
        .where('id = :id', { id: el.id })
        .execute();

      const excelFile = xlsx.parse(fs.readFileSync(el.path));

      const workName = excelFile[0].data
        .slice(1)
        .filter((el: any) => el.length)[0][1];

      const jobsIds = await this.jobsRepository
        .createQueryBuilder('jobs')
        .select(['jobs.id as id'])
        .where('jobs.title = :title', { title: workName.trim() })
        .getRawMany();

      const jobsCount = await this.jobsRepository
        .createQueryBuilder('jobs')
        .select(['COUNT(jobs.id) as count'])
        .where('jobs.title = :title', { title: workName.trim() })
        .getRawOne();

      const ids = jobsIds.map((el) => el.id);

      await this.jobsFavoritesRepository
        .createQueryBuilder()
        .delete()
        .from(JobsFavorites)
        .where('job_id IN (:...ids)', { ids: [0, ...ids] })
        .execute();

      await this.jobsResponsesRepository
        .createQueryBuilder()
        .delete()
        .from(JobsResponses)
        .where('job_id IN (:...ids)', { ids: [0, ...ids] })
        .execute();

      await this.jobsRepository
        .createQueryBuilder()
        .delete()
        .from(Jobs)
        .where('id IN (:...ids)', { ids: [0, ...ids] })
        .execute();

      for await (const el of excelFile[0].data
        .slice(1)
        .filter((el: any) => el.length)) {
        const address = await axios.get(
          `https://catalog.api.2gis.ru/3.0/items?key=demo&q=${`${el[0]}, ${el[2]}`}&fields=items.locale,items.point,items.flags,search_attributes,items.city_alias,items.region_id,items.segment_id,items.reviews,items.point,request_type,context_rubrics,query_context,items.links,items.name_ex,items.name_back,items.org,items.group,items.external_content,items.comment,items.ads.options,items.email_for_sending.allowed,items.stat,items.description,items.geometry.centroid,items.geometry.selection,items.geometry.style,items.timezone_offset,items.context,items.address,items.is_paid,items.access,items.access_comment,items.for_trucks,items.is_incentive,items.paving_type,items.capacity,items.schedule,items.floors,dym,ad,items.rubrics,items.routes,items.reply_rate,items.purpose,items.attribute_groups,items.route_logo,items.has_goods,items.has_apartments_info,items.has_pinned_goods,items.has_realty,items.has_payments,items.is_promoted,items.delivery,items.order_with_cart,search_type,items.has_discount,items.metarubrics,broadcast,items.detailed_subtype,items.temporary_unavailable_atm_services,items.poi_category,filters,widgets&type=adm_div.city,adm_div.district,adm_div.district_area,adm_div.division,adm_div.living_area,adm_div.place,adm_div.region,adm_div.settlement,attraction,branch,building,crossroad,foreign_city,gate,parking,road,route,station,street,coordinates,kilometer_road_sign&page_size=12&page=1&locale=ru_RU&allow_deleted=true&search_device_type=desktop&search_user_hash=7149010526544356454&viewpoint1=30.393263096758304,59.740407046012564&viewpoint2=30.39737677567593,59.73702696470926&stat[sid]=d0863f49-84df-4a62-b597-60333d8b7566&stat[user]=fd4b2c6c-c951-4b89-a40c-8b03e74fe7be&shv=2023-03-31-17&r=1135180620&utm_referrer=&fa821dba_ipp_key=v1680510225985%2fv33947245ba5adc7a72e272%2ff56PoAzzh8t5cw6E%2fQkqDg%3d%3d&fa821dba_ipp_uid=1680510225983%2fDtX59H4Evwx5HmxK%2fyzTSRWEuAYSPtWkUmdUurQ%3d%3d`,
        );

        if (
          address?.data &&
          address?.data?.result &&
          address?.data?.result?.items?.length
        ) {
          const findDuplicate = await this.jobsRepository
            .createQueryBuilder('jobs')
            .select(['*'])
            .where('jobs.title = :title', { title: el[1] })
            .andWhere('jobs.address = :address', {
              address: address.data.result.items[0].full_name
                ? address.data.result.items[0].full_name.split(',')[0]
                : address.data.result.items[0].address_name,
            })
            .andWhere('jobs.description = :description', { description: el[3] })
            .getRawOne();

          if (!findDuplicate) {
            try {
              let findCity = await this.citiesRepository
                .createQueryBuilder('cities')
                .select(['*'])
                .where('cities.title = :title', {
                  title: `%${
                    address.data.result.items[0].full_name
                      ? address.data.result.items[0].full_name.split(',')[0]
                      : address.data.result.items[0].address_name
                  }%`,
                })
                .orWhere('cities.title = :title2', {
                  title2: el[0]?.trim(),
                })
                .getRawOne();

              if (!findCity) {
                findCity = await this.citiesRepository
                  .createQueryBuilder('cities')
                  .select(['*'])
                  .where('cities.title LIKE :title', {
                    title: `%${
                      address.data.result.items[0].full_name
                        ? address.data.result.items[0].full_name.split(',')[0]
                        : address.data.result.items[0].address_name
                    }%`,
                  })
                  .orWhere('cities.title LIKE :title2', {
                    title2: el[0]?.trim(),
                  })
                  .getRawOne();

                if (!findCity) continue;
              }

              let cleaned: any = el;

              cleaned = cleaned.filter((el: any) => el !== '');

              let jobNameWithFirstLetterUppercase = cleaned[3];

              jobNameWithFirstLetterUppercase =
                jobNameWithFirstLetterUppercase.toLowerCase();

              jobNameWithFirstLetterUppercase =
                jobNameWithFirstLetterUppercase.slice(0, 1).toUpperCase() +
                jobNameWithFirstLetterUppercase.slice(1);

              jobNameWithFirstLetterUppercase = jobNameWithFirstLetterUppercase
                .split('[')[0]
                .trim();

              if (cleaned[1].trim().length < 40)
                await this.jobsRepository
                  .createQueryBuilder()
                  .insert()
                  .into(Jobs)
                  .values({
                    title: cleaned[1].trim(),
                    address: address.data.result.items[0].full_name
                      ? address.data.result.items[0].full_name
                      : address.data.result.items[0].address_name,
                    description: jobNameWithFirstLetterUppercase,
                    terms: `${cleaned[5]}\n\nОбязанности:\n${cleaned[6]}`,
                    salary:
                      cleaned[4] !== ''
                        ? String(cleaned[4]).includes('0 - 0')
                          ? '0'
                          : cleaned[4]
                        : '0',
                    latitude: address.data.result.items[0].point.lat,
                    longitude: address.data.result.items[0].point.lon,
                    city_id: findCity.id,
                    created_at: getCurrentTimestamp(),
                  })
                  .execute();
            } catch (e) {
              console.log(e);
            }
          }
        }
      }

      const jobsNewCount = await this.jobsRepository
        .createQueryBuilder('jobs')
        .select(['COUNT(jobs.id) as count'])
        .where('jobs.title = :title', { title: workName.trim() })
        .getRawOne();

      if (jobsNewCount.count > jobsCount.count) {
        const subscribers = await this.jobsSubscriptionsRepository
          .createQueryBuilder('jobs_subscriptions')
          .select([
            'jobs_subscriptions.created_by as created_by',
            'users.user_id as user_id',
            'users.platform as platform',
            'users.notifications as notifications',
          ])
          .where('jobs_subscriptions.title = :title', {
            title: workName.trim(),
          })
          .innerJoin('jobs_subscriptions.created_by', 'users')
          .getRawMany();

        const usersWithNotifications = subscribers.filter(
          (el) => el.notifications && el.platform === 'vk' && el.user_id,
        );

        const usersFromTelegram = subscribers.filter(
          (el) => el.platform === 'tg',
        );

        const text = `Компания ${workName.trim()} загрузила новые вакансии!`;

        await sendPushNotifications(
          null,
          'vk',
          usersWithNotifications,
          text,
          null,
        );

        const tgIds = usersFromTelegram.map((el) => el.user_id);

        await sendPushNotifications(null, 'tg', tgIds, text, null);

        const subscriberIds = subscribers.map((el) => el.created_by);

        await sendPushNotifications(
          this.devicesRepository,
          'external',
          subscriberIds,
          `Новые вакансии`,
          text,
        );
      }

      fs.rmSync(el.path);
    }
  }
}
