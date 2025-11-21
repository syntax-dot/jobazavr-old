import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionsData {
  @ApiProperty({
    description: 'Идентификатор подписки',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Имя компании',
    example: 'Пятёрочка',
  })
  title: string;
}
