import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDto } from 'src/dto/user-data.dto';
import { EventsKeys } from 'src/entities/events-keys.entity';
import { Events } from 'src/entities/events.entity';
import Errors from 'src/errors.enum';
import errorGenerator from 'src/utils/errorGenerator.utils';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { Repository } from 'typeorm';
import { EventsBody } from './dto/events-body.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventsKeys)
    private readonly eventsKeysRepository: Repository<EventsKeys>,

    @InjectRepository(Events)
    private readonly eventsRepository: Repository<Events>,
  ) {}

  async createEvent(user: UserDataDto, body: EventsBody): Promise<boolean> {
    const findEvent = await this.eventsKeysRepository
      .createQueryBuilder('events_keys')
      .select(['events_keys.id as id'])
      .where('events_keys.event_key = :event_key', {
        event_key: body.event_key,
      })
      .getRawOne();

    if (!findEvent) errorGenerator(Errors.EVENT_KEY_NOT_FOUND);

    await this.eventsRepository
      .createQueryBuilder()
      .insert()
      .into(Events)
      .values({
        created_at: getCurrentTimestamp(),
        created_by: user.id,
        event_data: body.event_data,
        event_id: findEvent.id,
      })
      .execute();

    return true;
  }
}
