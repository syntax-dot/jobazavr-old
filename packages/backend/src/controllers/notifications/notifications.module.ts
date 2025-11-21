import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devices } from 'src/entities/devices.entity';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [TypeOrmModule.forFeature([Devices])],
})
export class NotificationsModule {}
