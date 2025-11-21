import { Module } from '@nestjs/common';
import { UsersExportService } from './users-export.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';

@Module({
  providers: [UsersExportService],
  imports: [TypeOrmModule.forFeature([Users])],
})
export class UsersExportModule {}
