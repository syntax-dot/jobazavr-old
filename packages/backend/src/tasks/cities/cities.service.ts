import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cities } from 'src/entities/cities.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(Cities)
    private readonly citiesRepository: Repository<Cities>,
  ) {}

  async handle(): Promise<void> {
    const parsedJson = fs.readFileSync(
      '/Users/lukasandreano/Downloads/russian-cities.json',
      'utf8',
    );

    const cities = JSON.parse(parsedJson);

    for await (const city of cities) {
      const findCity = await this.citiesRepository
        .createQueryBuilder('cities')
        .where('cities.title = :title', { title: city.name })
        .getRawOne();

      if (!findCity) {
        await this.citiesRepository
          .createQueryBuilder()
          .insert()
          .into(Cities)
          .values({
            title: city.name,
            latitude: city.coords.lat,
            longitude: city.coords.lon,
          })
          .execute();
      }
    }
  }
}
