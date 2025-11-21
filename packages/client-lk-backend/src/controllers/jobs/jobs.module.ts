import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from 'src/entities/cities.entity';
import { Jobs } from 'src/entities/jobs.entity';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [TypeOrmModule.forFeature([Jobs, Cities])],
})
export class JobsModule {}
