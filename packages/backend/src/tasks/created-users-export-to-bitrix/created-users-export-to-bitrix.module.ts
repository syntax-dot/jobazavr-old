import { Module } from '@nestjs/common';
import { CreatedUsersExportToBitrixService } from './created-users-export-to-bitrix.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Citizenships } from 'src/entities/citizenships.entity';

@Module({
  providers: [CreatedUsersExportToBitrixService],
  imports: [TypeOrmModule.forFeature([Users, Citizenships])],
})
export class CreatedUsersExportToBitrixModule {}
