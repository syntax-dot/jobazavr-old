import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Length } from 'class-validator';

export class AdminJobsPatchBody {
  @ApiProperty({
    description: 'Наименование вакансии',
    example: 'Пятёрочка',
  })
  @IsOptional()
  @Length(1, 256)
  title: string;

  @ApiProperty({
    description: 'Описание вакансии',
    example: 'Приглашаем на работу в магазин Пятёрочка',
  })
  @IsOptional()
  @Length(1, 256)
  description: string;

  @ApiProperty({
    description: 'Условия работы',
    example: 'Условия работы',
  })
  @IsOptional()
  @Length(1, 1024)
  terms: string;

  @ApiProperty({
    description: 'Зарплата',
    example: '10000',
  })
  @IsOptional()
  @Length(1, 64)
  salary: string;

  @ApiProperty({
    description: 'Идентификатор города',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  city_id: number;

  @ApiProperty({
    description: 'Адрес вакансии',
    example: 'Москва, ул. Ленина, д. 1',
  })
  @IsOptional()
  @Length(1, 256)
  address: string;

  latitude?: number;

  longitude?: number;
}

export class AdminJobsDelete {
  @ApiProperty({
    description: 'Наименование вакансии',
    example: 'Пятёрочка',
  })
  @IsOptional()
  @Length(1, 256)
  title: string;
}
