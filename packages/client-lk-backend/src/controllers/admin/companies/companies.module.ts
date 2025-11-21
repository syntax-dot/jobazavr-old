import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [TypeOrmModule.forFeature([Users])],
})
export class CompaniesModule {}
