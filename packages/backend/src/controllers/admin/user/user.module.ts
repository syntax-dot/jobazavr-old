import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Citizenships } from 'src/entities/citizenships.entity';
import { Events } from 'src/entities/events.entity';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { Users } from 'src/entities/users.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([Users, Events, Citizenships, JobsResponses]),
  ],
})
export class UserModule {}
