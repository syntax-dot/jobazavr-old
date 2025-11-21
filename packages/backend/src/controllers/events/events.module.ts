import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsKeys } from 'src/entities/events-keys.entity';
import { Events } from 'src/entities/events.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [TypeOrmModule.forFeature([EventsKeys, Events])],
})
export class EventsModule {}
