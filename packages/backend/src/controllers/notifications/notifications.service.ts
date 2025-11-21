import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataDto } from 'src/dto/get-data.dto';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Devices } from 'src/entities/devices.entity';
import { Repository } from 'typeorm';
import { NotificationsCreateBody } from './dto/notifications-body.dto';
import { CreateDataDto } from 'src/dto/create-data.dto';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';
import { OrdersGetData } from './dto/notifications-data.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Devices)
    private readonly devicesRepository: Repository<Devices>,
  ) {}

  async getDevices(
    user: UserDataDto,
    query: GetDataDto,
  ): Promise<OrdersGetData[]> {
    const devices = await this.devicesRepository
      .createQueryBuilder('devices')
      .select([
        'devices.id as id',
        'devices.label as label',
        'devices.created_at as created_at',
      ])
      .where('devices.created_by = :created_by', {
        created_by: user.id,
      })
      .orderBy('devices.created_at', 'DESC')
      .limit(query.limit || 10)
      .offset(query.offset || 0)
      .getRawMany();

    return devices;
  }

  async createDevice(
    user: UserDataDto,
    body: NotificationsCreateBody,
  ): Promise<CreateDataDto> {
    const findDuplicate = await this.devicesRepository
      .createQueryBuilder('devices')
      .select(['devices.id as id'])
      .where('devices.created_by = :created_by', {
        created_by: user.id,
      })
      .andWhere('devices.token = :token', {
        token: body.token,
      })
      .getRawOne();

    if (findDuplicate) return { id: findDuplicate.id };

    const device = await this.devicesRepository
      .createQueryBuilder('devices')
      .insert()
      .into(Devices)
      .values({
        created_at: getCurrentTimestamp(),
        created_by: user.id,
        label: body.label,
        token: body.token,
      })
      .execute();

    return { id: device.identifiers[0].id };
  }

  async deleteDevice(user: UserDataDto, id: number): Promise<boolean> {
    const findDevice = await this.devicesRepository
      .createQueryBuilder('devices')
      .select(['devices.id as id'])
      .where('devices.created_by = :created_by', {
        created_by: user.id,
      })
      .andWhere('devices.id = :id', {
        id,
      })
      .getRawOne();

    if (!findDevice) errorGenerator(Errors.NOT_FOUND);

    await this.devicesRepository
      .createQueryBuilder('devices')
      .delete()
      .where('devices.created_by = :created_by', {
        created_by: user.id,
      })
      .andWhere('devices.id = :id', {
        id,
      })
      .execute();

    return true;
  }
}
