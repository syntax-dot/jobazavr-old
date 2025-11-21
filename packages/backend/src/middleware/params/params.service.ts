import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Users } from 'src/entities/users.entity';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { Repository } from 'typeorm';
import { API } from 'vk-io';
import { UsersGetResponse } from 'vk-io/lib/api/schemas/responses';

@Injectable()
export class ParamsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getUser(
    user,
    isFromVK: boolean,
    platform: string,
  ): Promise<UserDataDto> {
    // const cached = await this.redis.get(
    //   `jobazavr_user:${platform}:${platform !== 'vk' ? user : user.id}`,
    // );

    // if (cached) return JSON.parse(cached);

    let userData;

    if (isFromVK) {
      const api = new API({
        token: process.env.APP_TOKEN,
      });

      let userInfo: UsersGetResponse;

      let name: string;

      userData = await this.usersRepository
        .createQueryBuilder('users')
        .select(['*'])
        .where('users.user_id = :user_id', { user_id: user })
        .andWhere('users.platform = :platform', {
          platform: 'vk',
        })
        .getRawOne();

      if (!userData || userData.updated_at < getCurrentTimestamp()) {
        userInfo = await api.users.get({
          user_ids: [user],
          lang: 'ru',
        });

        name = userInfo[0].first_name + ' ' + userInfo[0].last_name;

        if (!userData) {
          const values = {
            user_id: user,
            name,
            platform: 'vk',
            joined_at: Math.floor(Date.now() / 1000),
          };

          const insertAction = await this.usersRepository
            .createQueryBuilder()
            .insert()
            .into(Users)
            .values(values)
            .execute();

          userData = {
            ...values,
            id: insertAction.identifiers[0].id,
          };
        }
      }
    } else if (platform === 'tg') {
      userData = await this.usersRepository
        .createQueryBuilder('users')
        .select(['*'])
        .where('users.user_id = :user_id', { user_id: user.id })
        .andWhere('users.platform = :platform', {
          platform: 'tg',
        })
        .getRawOne();

      if (!userData || userData.updated_at < getCurrentTimestamp()) {
        if (!userData) {
          const values = {
            user_id: user.id,
            name: `${user?.first_name} ${user?.last_name}`,
            platform: 'tg',
            joined_at: Math.floor(Date.now() / 1000),
          };

          const insertAction = await this.usersRepository
            .createQueryBuilder()
            .insert()
            .into(Users)
            .values(values)
            .execute();

          userData = {
            ...values,
            id: insertAction.identifiers[0].id,
          };
        }
      }
    } else {
      userData = await this.usersRepository
        .createQueryBuilder('users')
        .select(['*'])
        .where('users.id = :id', { id: user })
        .andWhere('users.platform = :platform', {
          platform: 'mob',
        })
        .getRawOne();
    }

    await this.redis.set(
      `jobazavr_user:${platform}:${platform !== 'vk' ? user : user.id}`,
      JSON.stringify(userData),
      'EX',
      300,
    );

    return userData;
  }
}
