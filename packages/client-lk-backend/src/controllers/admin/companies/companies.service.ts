import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataDto } from 'src/dto/get-data.dto';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { AdminCompaniesData } from './dto/companies-data.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getCompanies(query: GetDataDto): Promise<AdminCompaniesData[]> {
    const companies = await this.usersRepository
      .createQueryBuilder('users')
      .select([
        'users.id as id',
        'users.organization_name as organization_name',
        'users.phone as phone',
        'users.joined_at as created_at',
      ])
      .where('users.organization_name LIKE :organization_name', {
        organization_name: query?.query ? `%${query?.query}%` : '%',
      })
      .limit(query?.limit ? query?.limit : 50)
      .offset(query?.offset ? query?.offset : 0)
      .getRawMany();

    return companies;
  }
}
