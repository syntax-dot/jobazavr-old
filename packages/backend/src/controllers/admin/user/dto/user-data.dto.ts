import { ApiProperty } from '@nestjs/swagger';
import { CitizenshipsDataDto } from 'src/controllers/citizenships/dto/citizenships-data.dto';

class Replies {
  @ApiProperty({
    description: 'Идентификатор ответа',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Наименование вакансии',
    example: 'Пятёрочка',
  })
  title: string;

  @ApiProperty({
    description: 'Описание вакансии',
    example: 'Приглашаем на работу в магазин Пятёрочка',
  })
  description: string;

  @ApiProperty({
    description: 'Зарплата',
    example: 10000,
  })
  salary: number;

  @ApiProperty({
    description: 'Название города',
    example: 'Москва',
  })
  city: string;

  @ApiProperty({
    description: 'Условия работы',
    example: 'Полный рабочий день c 00:00 до 24:00',
  })
  terms: string;

  @ApiProperty({
    description: 'Дата создания ответа',
    example: 1610000000,
  })
  created_at: number;
}

class Events {
  @ApiProperty({
    description: 'Идентификатор ивента',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Заголовок ивента',
    example: 'Создание профиля',
  })
  title: string;

  @ApiProperty({
    description: 'Дата ивента',
    example: '{}',
  })
  data: string;

  @ApiProperty({
    description: 'Дата создания ивента',
    example: 1610000000,
  })
  created_at: number;
}

class User {
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
    example: CitizenshipsDataDto,
  })
  citizenship_id: CitizenshipsDataDto | null;
}

export class AdminUserData {
  @ApiProperty({
    description: 'Информация о пользователе',
    example: User,
  })
  user: User;

  @ApiProperty({
    description: 'Информация о ивентах пользователя (ласт 100)',
    example: Events,
  })
  events: Events[];

  @ApiProperty({
    description: 'Информация о ответах пользователя (ласт 100)',
    example: Replies,
  })
  replies: Replies[];
}
