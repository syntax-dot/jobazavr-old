import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devices } from 'src/entities/devices.entity';
import { Jobs } from 'src/entities/jobs.entity';
import { JobsSubscriptions } from 'src/entities/jobs-subscriptions.entity';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  imports: [TypeOrmModule.forFeature([Devices, Jobs, JobsSubscriptions])],
})
export class SubscriptionsModule {}
