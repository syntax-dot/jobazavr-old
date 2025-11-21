import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Citizenships } from 'src/entities/citizenships.entity';
import { Repository } from 'typeorm';
import { CitizenshipsDataDto } from './dto/citizenships-data.dto';

@Injectable()
export class CitizenshipsService {
  constructor(
    @InjectRepository(Citizenships)
    private readonly citizenshipsRepository: Repository<Citizenships>,

    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getCitizenships(): Promise<CitizenshipsDataDto[]> {
    const cached = await this.redis.get('jobazavr_citizenships');

    if (cached) return JSON.parse(cached);

    const citizenships = await this.citizenshipsRepository
      .createQueryBuilder('citizenships')
      .select(['citizenships.id as id', 'citizenships.title as title'])
      .getRawMany();

    await this.redis.set(
      'jobazavr_citizenships',
      JSON.stringify(citizenships),
      'EX',
      3600,
    );

    return citizenships;
  }
}
