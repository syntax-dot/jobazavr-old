import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Codes } from 'src/entities/codes.entity';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [TypeOrmModule.forFeature([Users, Codes])],
})
export class ProfileModule {}
