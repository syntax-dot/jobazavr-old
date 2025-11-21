import { ApiProperty } from '@nestjs/swagger';

export class EmployersData {
  @ApiProperty({
    description: 'Работодатели',
    example: ['Пятёрочка', 'Магнит', 'Дикси'],
  })
  employers: string[];

  @ApiProperty({
    description: 'Доступные вакансии',
    example: ['Продавец'],
  })
  vacancies: string[];

  @ApiProperty({
    description: 'Доступные города',
    example: [1, 2],
  })
  cities: number[] | undefined;
}

export class JobsData {
  @ApiProperty({
    description: 'Идентификатор вакансии',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Наименование вакансии',
    example: 'Пятёрочка',
  })
  title: string;

  @ApiProperty({
    description: 'Адрес вакансии',
    example: 'Москва, ул. Ленина, д. 1',
  })
  address: string;

  @ApiProperty({
    description: 'Описание вакансии',
    example: 'Приглашаем на работу в магазин Пятёрочка',
  })
  description: string;

  @ApiProperty({
    description: 'Баннер вакансии',
    example: 'https://example.com/banner.png',
  })
  banner: string;

  @ApiProperty({
    description: 'Аватар вакансии',
    example: 'https://example.com/avatar.png',
  })
  avatar: string;

  @ApiProperty({
    description: 'Зарплата',
    example: 10000,
  })
  salary: number;

  @ApiProperty({
    description: 'Идентификатор города',
    example: 1,
  })
  city_id: number;

  @ApiProperty({
    description: 'Широта',
    example: 55.753215,
  })
  latitude: number;

  @ApiProperty({
    description: 'Долгота',
    example: 37.622504,
  })
  longitude: number;

  @ApiProperty({
    description: 'Условия работы',
    example: 'Полный рабочий день c 00:00 до 24:00',
  })
  terms: string;
}
