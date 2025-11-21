import { ApiProperty } from '@nestjs/swagger';
import { CitizenshipsDataDto } from 'src/controllers/citizenships/dto/citizenships-data.dto';
import { CitiesData } from 'src/controllers/cities/dto/cities-data.dto';

export class InitializeData {
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
    description: 'Пол пользователя, 0 - не указан, 1 - жен, 2 - муж',
    example: 18,
  })
  sex: number;

  @ApiProperty({
    description: 'Город пользователя',
    example: CitiesData,
  })
  city: CitiesData;

  @ApiProperty({
    description: 'Статус администратора пользователя',
    example: true,
  })
  is_admin: boolean;

  @ApiProperty({
    description: 'Статус прохождения обучения пользователя',
    example: true,
  })
  onboarding: boolean;

  @ApiProperty({
    description: 'Статус уведомлений пользователя',
    example: true,
  })
  notifications: boolean | undefined;

  @ApiProperty({
    description:
      'Статус прохождения первого тренировочного занятия пользователя',
    example: true,
  })
  first_training: boolean;

  @ApiProperty({
    description: 'Информация о гражданстве пользователя',
    example: CitizenshipsDataDto,
  })
  citizenship: CitizenshipsDataDto | null;
}
