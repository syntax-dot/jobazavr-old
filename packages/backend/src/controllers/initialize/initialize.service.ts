import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Citizenships } from 'src/entities/citizenships.entity';
import { Repository } from 'typeorm';
import { InitializeData } from './dto/initialize-data.dto';
import { Cities } from 'src/entities/cities.entity';

@Injectable()
export class InitializeService {
  constructor(
    @InjectRepository(Citizenships)
    private readonly citizenshipsRepository: Repository<Citizenships>,

    @InjectRepository(Cities)
    private readonly citiesRepository: Repository<Cities>,
  ) {}

  async initialize(user: UserDataDto): Promise<InitializeData> {
    let citizenship = null;

    if (user.citizenship_id) {
      citizenship = await this.citizenshipsRepository
        .createQueryBuilder('citizenships')
        .select(['citizenships.id as id', 'citizenships.title as title'])
        .where('citizenships.id = :id', { id: user.citizenship_id })
        .getRawOne();
    }

    let city = null;

    if (user.city_id)
      city = await this.citiesRepository
        .createQueryBuilder('cities')
        .select([
          'cities.id as id',
          'cities.title as title',
          'cities.latitude as latitude',
          'cities.longitude as longitude',
        ])
        .where('cities.id = :id', { id: user.city_id })
        .getRawOne();

    return {
      name: user.name,
      phone: user.phone,
      age: user.age,
      city,
      sex: user.sex,
      is_admin: user.is_admin,
      onboarding: +user.onboarding === 1,
      notifications: user.platform === 'vk' ? user.notifications : undefined,
      first_training: +user.first_training === 1,
      citizenship,
    };
  }
}
