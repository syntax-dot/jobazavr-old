import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';

@Module({
  controllers: [RepliesController],
  providers: [RepliesService],
  imports: [TypeOrmModule.forFeature([JobsResponses])],
})
export class RepliesModule {}
