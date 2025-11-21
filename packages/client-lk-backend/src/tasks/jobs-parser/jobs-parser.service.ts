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
import { SyncQueue } from 'src/entities/sync-queue.entity';

@Injectable()
export class JobsParserService {
  constructor(
    @InjectRepository(Cities)
    private readonly citiesRepository: Repository<Cities>,

    @InjectRepository(Jobs)
    private readonly jobsRepository: Repository<Jobs>,

    @InjectRepository(SyncQueue)
    private readonly syncQueueRepository: Repository<SyncQueue>,

    @InjectRepository(UploadedFiles)
    private readonly uploadedFilesRepository: Repository<UploadedFiles>,
  ) {}

  @Cron('* * * * *')
  async handleCron(): Promise<void> {
    const findFile = await this.uploadedFilesRepository
      .createQueryBuilder('uploaded_files')
      .select([
        'uploaded_files.path as path',
        'uploaded_files.id as id',
        'uploaded_files.uploaded_by as uploaded_by',
      ])
      .orderBy('uploaded_files.created_at', 'DESC')
      .getRawMany();

    if (!findFile.length) return;

    for await (const el of findFile) {
      const uploaded_by = el.uploaded_by;

      await this.uploadedFilesRepository
        .createQueryBuilder()
        .delete()
        .from(UploadedFiles)
        .where('id = :id', { id: el.id })
        .andWhere('uploaded_by = :uploaded_by', {
          uploaded_by,
        })
        .execute();

      const excelFile = xlsx.parse(fs.readFileSync(el.path));

      const workName = excelFile[0].data
        .slice(1)
        .filter((el: any) => el.length)[0][1];

      const jobsIds = await this.jobsRepository
        .createQueryBuilder('jobs')
        .select(['jobs.id as id'])
        .where('jobs.title = :title', { title: workName.trim() })
        .andWhere('jobs.created_by = :created_by', {
          created_by: uploaded_by,
        })
        .getRawMany();

      const ids = jobsIds.map((el) => el.id);

      await this.jobsRepository
        .createQueryBuilder()
        .delete()
        .from(Jobs)
        .where('id IN (:...ids)', { ids: [0, ...ids] })
        .andWhere('created_by = :created_by', {
          created_by: uploaded_by,
        })
        .execute();

      for await (const el of excelFile[0].data
        .slice(1)
        .filter((el: any) => el.length)) {
        const address = await axios.get(
          `https://catalog.api.2gis.ru/3.0/items?key=demo&q=${`${el[0]}, ${el[2]}`}&fields=items.locale,items.point,items.flags,search_attributes,items.city_alias,items.region_id,items.segment_id,items.reviews,items.point,request_type,context_rubrics,query_context,items.links,items.name_ex,items.name_back,items.org,items.group,items.external_content,items.comment,items.ads.options,items.email_for_sending.allowed,items.stat,items.description,items.geometry.centroid,items.geometry.selection,items.geometry.style,items.timezone_offset,items.context,items.address,items.is_paid,items.access,items.access_comment,items.for_trucks,items.is_incentive,items.paving_type,items.capacity,items.schedule,items.floors,dym,ad,items.rubrics,items.routes,items.reply_rate,items.purpose,items.attribute_groups,items.route_logo,items.has_goods,items.has_apartments_info,items.has_pinned_goods,items.has_realty,items.has_payments,items.is_promoted,items.delivery,items.order_with_cart,search_type,items.has_discount,items.metarubrics,broadcast,items.detailed_subtype,items.temporary_unavailable_atm_services,items.poi_category,filters,widgets&type=adm_div.city,adm_div.district,adm_div.district_area,adm_div.division,adm_div.living_area,adm_div.place,adm_div.region,adm_div.settlement,attraction,branch,building,crossroad,foreign_city,gate,parking,road,route,station,street,coordinates,kilometer_road_sign&page_size=12&page=1&locale=ru_RU&allow_deleted=true&search_device_type=desktop&search_user_hash=7149010526544356454&viewpoint1=30.393263096758304,59.740407046012564&viewpoint2=30.39737677567593,59.73702696470926&stat[sid]=d0863f49-84df-4a62-b597-60333d8b7566&stat[user]=fd4b2c6c-c951-4b89-a40c-8b03e74fe7be&shv=2023-03-31-17&r=1135180620&utm_referrer=&fa821dba_ipp_key=v1680510225985%2fv33947245ba5adc7a72e272%2ff56PoAzzh8t5cw6E%2fQkqDg%3d%3d&fa821dba_ipp_uid=1680510225983%2fDtX59H4Evwx5HmxK%2fyzTSRWEuAYSPtWkUmdUurQ%3d%3d`,
        );

        console.log(address?.data?.result);
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
            .andWhere('jobs.created_by = :created_by', {
              created_by: uploaded_by,
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

              if (cleaned[1].trim().length < 40) {
                const findDuplicateEntry = await this.jobsRepository
                  .createQueryBuilder('jobs')
                  .select(['*'])
                  .where('jobs.title = :title', { title: cleaned[1].trim() })
                  .andWhere('jobs.description = :description', {
                    description: jobNameWithFirstLetterUppercase,
                  })
                  .andWhere('jobs.latitude = :latitude', {
                    latitude: address.data.result.items[0].point.lat,
                  })
                  .andWhere('jobs.longitude = :longitude', {
                    longitude: address.data.result.items[0].point.lon,
                  })
                  .andWhere('jobs.created_by = :created_by', {
                    created_by: uploaded_by,
                  })
                  .getRawOne();

                if (!findDuplicateEntry)
                  await this.jobsRepository
                    .createQueryBuilder()
                    .insert()
                    .into(Jobs)
                    .values({
                      created_by: uploaded_by,
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
              }
            } catch (e) {
              console.log(e);
            }
          }
        }
      }

      await this.syncQueueRepository
        .createQueryBuilder()
        .insert()
        .into(SyncQueue)
        .values({
          created_by: uploaded_by,
          created_at: getCurrentTimestamp(),
        })
        .execute();

      fs.rmSync(el.path);
    }
  }
}
