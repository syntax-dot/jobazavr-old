import { Module } from '@nestjs/common';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from 'src/entities/jobs.entity';
import { JobsResponses } from 'src/entities/jobs-responses.entity';

@Module({
  controllers: [RepliesController],
  providers: [RepliesService],
  imports: [TypeOrmModule.forFeature([Jobs, JobsResponses])],
})
export class RepliesModule {}
