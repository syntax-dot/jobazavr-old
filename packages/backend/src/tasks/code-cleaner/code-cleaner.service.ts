import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Codes } from 'src/entities/codes.entity';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { Repository } from 'typeorm';

@Injectable()
export class CodeCleanerService {
  constructor(
    @InjectRepository(Codes)
    private readonly codesRepository: Repository<Codes>,
  ) {}

  @Cron('* * * * *')
  async handleCron() {
    const codes = await this.codesRepository
      .createQueryBuilder('codes')
      .select(['codes.id'])
      .where('codes.sent_at < :sent_at', {
        sent_at: getCurrentTimestamp() - 60 * 5,
      })
      .getRawMany();

    const ids = codes.map((code) => code.id);

    await this.codesRepository
      .createQueryBuilder('codes')
      .delete()
      .where('codes.id IN (:...ids)', { ids: [0, ...ids] })
      .execute();
  }
}
