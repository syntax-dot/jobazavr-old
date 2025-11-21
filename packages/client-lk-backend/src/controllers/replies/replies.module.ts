import { Module } from '@nestjs/common';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from 'src/entities/jobs.entity';

@Module({
  controllers: [RepliesController],
  providers: [RepliesService],
  imports: [TypeOrmModule.forFeature([Jobs])],
})
export class RepliesModule {}
