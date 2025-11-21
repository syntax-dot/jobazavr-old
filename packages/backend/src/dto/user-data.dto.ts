import { ApiProperty } from '@nestjs/swagger';

export class UserDataDto {
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Идентификатор пользователя в VK',
    example: 123456789,
  })
  user_id: number;

  @ApiProperty({
    description: 'Статус администратора пользователя',
    example: true,
  })
  is_admin: boolean;

  @ApiProperty({
    description: 'Пол пользователя, 0 - не указан, 1 - жен, 2 - муж',
    example: 18,
  })
  sex: number;

  @ApiProperty({
    description: 'Идентификатор города пользователя',
    example: 1,
  })
  city_id: number | null;

  @ApiProperty({
    description: 'Имя и фамилия пользователя',
    example: 'Никита Балин',
  })
  name: string;

  @ApiProperty({
    description: 'Телефон пользователя',
    example: 18,
  })
  phone: string | null;

  @ApiProperty({
    description: 'Возраст пользователя',
    example: 18,
  })
  age: number | null;

  @ApiProperty({
    description: 'Идентификатор гражданства пользователя',
    example: 1,
  })
  citizenship_id: number | null;

  @ApiProperty({
    description: 'Статус прохождения обучения пользователя',
    example: true,
  })
  onboarding: boolean;

  @ApiProperty({
    description: 'Статус уведомлений пользователя',
    example: true,
  })
  notifications: boolean;

  @ApiProperty({
    description:
      'Статус прохождения первого тренировочного занятия пользователя',
    example: true,
  })
  first_training: boolean;

  @ApiProperty({
    description: 'Платформа пользователя',
    example: 'vk',
  })
  platform: string;

  @ApiProperty({
    description: 'Дата регистрации пользователя (timestamp)',
    example: 1610000000,
  })
  joined_at: number;
}
