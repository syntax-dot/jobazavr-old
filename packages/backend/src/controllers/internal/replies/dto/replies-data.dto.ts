import { ApiProperty } from '@nestjs/swagger';

export class ExternalRepliesData {
  @ApiProperty({
    description: 'Идентификатор вакансии',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Адрес вакансии',
    example: 'Москва, ул. Ленина, д. 1',
  })
  address: string;

  @ApiProperty({
    description: 'Заголовок вакансии',
    example: 'Продавец-кассир',
  })
  title: string;

  @ApiProperty({
    description: 'Описание вакансии',
    example: 'Продавец-кассир',
  })
  description: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
  })
  name: string;

  @ApiProperty({
    description: 'Телефон пользователя',
    example: '79999999999',
  })
  phone: string;

  @ApiProperty({
    description: 'Возраст пользователя',
    example: '18',
  })
  age: string;

  @ApiProperty({
    description: 'Платформа пользователя',
    example: 'ios',
  })
  platform: string;

  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: '1',
  })
  user_id: string;
}
