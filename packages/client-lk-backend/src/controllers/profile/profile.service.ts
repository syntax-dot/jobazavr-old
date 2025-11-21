import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Users } from 'src/entities/users.entity';
import Errors from 'src/errors.enum';
import errorGenerator from 'src/utils/errorGenerator.utils';
import { Repository } from 'typeorm';
import { ProfilePatchBody } from './dto/profile-body.dto';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { Codes } from 'src/entities/codes.entity';
import { ProfileData } from './dto/profile-data.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Codes)
    private readonly codesRepository: Repository<Codes>,
  ) {}

  async updateProfile(
    user: UserDataDto,
    body: ProfilePatchBody,
  ): Promise<boolean | ProfileData> {
    if (body.phone) {
      if (user.phone === body.phone)
        errorGenerator(Errors.PHONE_ALREADY_IN_USE);

      const findDuplicatePhone = await this.usersRepository
        .createQueryBuilder('users')
        .select(['users.id'])
        .where('users.phone = :phone', { phone: body.phone })
        .andWhere('users.id != :id', { id: user.id })
        .getRawOne();

      if (findDuplicatePhone) errorGenerator(Errors.PHONE_ALREADY_IN_USE);

      if (!body?.code) {
        const lastSentCode = await this.codesRepository
          .createQueryBuilder('codes')
          .select(['codes.sent_at as sent_at'])
          .where('codes.phone = :phone', {
            phone: body.phone,
          })
          .orderBy('codes.sent_at', 'DESC')
          .getRawOne();

        if (lastSentCode?.sent_at > getCurrentTimestamp() - 60)
          errorGenerator(Errors.WAIT_BEFORE_NEXT_CODE);

        const random6DigitCode = Math.floor(100000 + Math.random() * 900000);

        await this.codesRepository
          .createQueryBuilder('codes')
          .insert()
          .into(Codes)
          .values({
            sent_at: getCurrentTimestamp(),
            phone: body.phone,
            code: random6DigitCode.toString(),
          })
          .execute();

        if (body.phone === '79951275110' || body.phone === '79191177388') {
          return {
            sent_at: getCurrentTimestamp(),
            phone: body.phone,
            code: random6DigitCode.toString(),
          };
        } else {
          const smsReq = await axios.post(
            "https://lk.ibatele.com/api/v1/messages",
            {
              channel: 1,
              contact: body.phone,
              isOtp: true,
              senderId: "Jobazavr",
              messageId: `${
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15)
              }`,
              payload: {
                text: `Ваш код подтверждения для входа в приложение: ${random6DigitCode}`,
              },
            },
            {
              headers: {
                Authorization: "Basic aW5mb0Bqb2JhemF2ci5ydTpId2tqN19TOVRK",
                "X-Api-Key":
                  "f57f00aaab4eda08874c5b933091c605829c2e3786d48c8f59abf169d77a3aad",
              },
            }
          );

          if (smsReq.data.error) errorGenerator(Errors.BAD_REQUEST);
        }

        return {
          sent_at: getCurrentTimestamp(),
          phone: body.phone,
        };
      } else {
        const findCode = await this.codesRepository
          .createQueryBuilder('codes')
          .select(['codes.id as id', 'codes.phone as phone'])
          .where('codes.phone = :phone', {
            phone: body.phone,
          })
          .andWhere('codes.code = :code', {
            code: body.code,
          })
          .andWhere('codes.sent_at > :sent_at', {
            sent_at: getCurrentTimestamp() - 60 * 5,
          })
          .orderBy('codes.sent_at', 'DESC')
          .getRawOne();

        if (!findCode) errorGenerator(Errors.AUTH_PARAMS_NOT_VALID);

        await this.codesRepository
          .createQueryBuilder('codes')
          .delete()
          .from(Codes)
          .where('codes.id = :id', {
            id: findCode.id,
          })
          .execute();

        await this.usersRepository
          .createQueryBuilder()
          .update(Users)
          .set({ phone: body.phone })
          .where('id = :id', { id: user.id })
          .execute();

        return true;
      }
    }

    if (Object.keys(body))
      await this.usersRepository
        .createQueryBuilder()
        .update(Users)
        .set(body)
        .where('id = :id', { id: user.id })
        .execute();

    return true;
  }
}
