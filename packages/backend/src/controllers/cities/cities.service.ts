import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataDto } from 'src/dto/get-data.dto';
import { Cities } from 'src/entities/cities.entity';
import { Repository } from 'typeorm';
import { CitiesData } from './dto/cities-data.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(Cities)
    private readonly citiesRepository: Repository<Cities>,
  ) {}

  async getCities(query: GetDataDto): Promise<CitiesData[]> {
    const cities = await this.citiesRepository
      .createQueryBuilder('cities')
      .select([
        'cities.id as id',
        'cities.title as title',
        'cities.latitude as latitude',
        'cities.longitude as longitude',
      ])
      .where(`cities.title LIKE :search`, {
        search: query?.query ? `%${query?.query}%` : '%',
      })
      .limit(+query.limit || 10)
      .offset(query.offset || 0)
      .getRawMany();

    return cities;
  }
}
