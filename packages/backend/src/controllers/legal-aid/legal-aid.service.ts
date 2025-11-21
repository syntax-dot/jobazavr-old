import { Injectable } from '@nestjs/common';
import { UserDataDto } from 'src/dto/user-data.dto';
import { LegalAidBody } from './dto/legal-aid-body.dto';
import replyToEmployer from 'src/utils/replyToEmployer.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Citizenships } from 'src/entities/citizenships.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LegalAidService {
  constructor(
    @InjectRepository(Citizenships)
    private readonly citizenshipsRepository: Repository<Citizenships>,
  ) {}

  async create(user: UserDataDto, body: LegalAidBody): Promise<boolean> {
    const findCitizenship = await this.citizenshipsRepository
      .createQueryBuilder('citizenships')
      .select(['citizenships.title as title'])
      .where('citizenships.id = :id', { id: user.citizenship_id })
      .getRawOne();

    await replyToEmployer(
      `Заявка на юридическую помощь из ${
        user.platform === 'vk'
          ? 'VK'
          : user.platform === 'mob'
          ? 'мобильного приложения'
          : 'Telegram'
      }!\n\nОтправитель: ${user.name}\nВозраст: ${user.age}\nТелефон: ${
        user.phone
      }\nГражданство: ${findCitizenship?.title || 'Не указано'}${
        user.platform === 'vk' ? `\n\nvk.com/id${user.user_id}` : ``
      }\n\nИнформация от пользователя:\n${body.text}`,
    );

    return true;
  }
}
