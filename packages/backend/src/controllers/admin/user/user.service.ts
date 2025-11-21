import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Citizenships } from 'src/entities/citizenships.entity';
import { Events } from 'src/entities/events.entity';
import { JobsResponses } from 'src/entities/jobs-responses.entity';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { AdminUserData } from './dto/user-data.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Citizenships)
    private readonly citizenshipsRepository: Repository<Citizenships>,

    @InjectRepository(Events)
    private readonly eventsRepository: Repository<Events>,

    @InjectRepository(JobsResponses)
    private readonly jobsResponsesRepository: Repository<JobsResponses>,
  ) {}

  async getUserData(vk_user_id: number): Promise<AdminUserData> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .select([
        'users.id as id',
        'users.user_id as user_id',
        'users.name as name',
        'users.phone as phone',
        'users.age as age',
        'users.citizenship_id as citizenship_id',
      ])
      .where('users.user_id = :vk_user_id', { vk_user_id })
      .getRawOne();

    if (!user || !user.citizenship_id) return null;

    const findCitizenship = await this.citizenshipsRepository
      .createQueryBuilder('citizenships')
      .select(['citizenships.id as id', 'citizenships.title as title'])
      .where('citizenships.id = :id', { id: user.citizenship_id })
      .getRawOne();

    user.citizenship = findCitizenship;

    user.citizenship_id = undefined;

    const events = await this.eventsRepository
      .createQueryBuilder('events')
      .select([
        'events.id as id',
        'events_keys.event_name as title',
        'events.event_data as data',
        'events.created_at as created_at',
      ])
      .innerJoin('events.event_id', 'events_keys')
      .where('events.created_by = :id', { id: user.id })
      .limit(100)
      .orderBy('events.created_at', 'DESC')
      .getRawMany();

    const jobsResponses = await this.jobsResponsesRepository
      .createQueryBuilder('jobs_responses')
      .select([
        'jobs_responses.id as id',
        'jobs.title as title',
        'jobs.description as description',
        'jobs.terms as terms',
        'jobs.salary as salary',
        'cities.title as city',
        'jobs_responses.created_at as created_at',
      ])
      .innerJoin('jobs_responses.job_id', 'jobs')
      .innerJoin('jobs.city_id', 'cities')
      .where('jobs_responses.created_by = :id', { id: user.id })
      .limit(100)
      .orderBy('jobs_responses.created_at', 'DESC')
      .getRawMany();

    return {
      user,
      events,
      replies: jobsResponses,
    };
  }
}
