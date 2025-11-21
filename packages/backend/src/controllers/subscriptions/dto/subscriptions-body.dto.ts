import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class SubscriptionsBody {
  @ApiProperty({
    description: 'Имя компании',
    example: 'Пятёрочка',
  })
  @Length(1, 256)
  @Transform(({ value }) => value?.trim())
  employer: string;
}
