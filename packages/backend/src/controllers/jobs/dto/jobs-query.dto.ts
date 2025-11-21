import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class JobsQueryGetDto {
  @ApiProperty({
    description: 'Количество вакансий в выдаче',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Max(1000)
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Смещение в выдаче',
    example: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset?: number;

  @ApiProperty({
    description: 'Компания',
    example: 'Компания',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 128)
  @Transform(({ value }) => value?.trim())
  @Transform(({ value }) => value?.toLowerCase())
  employer?: string;

  @ApiProperty({
    description: 'Вакансия',
    example: 'Вакансия',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 128)
  @Transform(({ value }) => value?.trim())
  @Transform(({ value }) => value?.toLowerCase())
  vacancy?: string;

  @ApiProperty({
    description: 'Зарплата от',
    example: 10000,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  salary_from?: number;

  @ApiProperty({
    description: 'Зарплата до',
    example: 10000,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  salary_to?: number;
}

export class JobsFiltersDataQueryDto {
  @ApiProperty({
    description: 'ID города',
    example: 'ID города',
  })
  @IsNumber()
  @IsOptional()
  city_id: number;

  @ApiProperty({
    description: 'Вакансия',
    example: 'Вакансия',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 128)
  @Transform(({ value }) => value?.trim())
  @Transform(({ value }) => value?.toLowerCase())
  vacancy?: string;

  @ApiProperty({
    description: 'Работодатель',
    example: 'ООО Рога и копыта',
  })
  @IsString()
  @IsOptional()
  @Length(1, 64)
  employer?: string;
}

export class JobsQueryDto {
  @ApiProperty({
    description: 'Широта',
    example: '55.753215',
  })
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'Долгота',
    example: '37.622504',
  })
  @IsNumber()
  longitude?: number;

  @ApiProperty({
    description: 'Радиус',
    example: '1000',
  })
  @IsNumber()
  radius?: number;

  @ApiProperty({
    description: 'Количество вакансий в выдаче',
    example: 100,
  })
  @IsNumber()
  @Max(1000)
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Смещение в выдаче',
    example: 0,
  })
  @IsNumber()
  @Min(0)
  offset?: number;

  @ApiProperty({
    description: 'Компания',
    example: 'Компания',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 128)
  @Transform(({ value }) => value?.trim())
  @Transform(({ value }) => value?.toLowerCase())
  employer?: string;

  @ApiProperty({
    description: 'Вакансия',
    example: 'Вакансия',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 128)
  @Transform(({ value }) => value?.trim())
  @Transform(({ value }) => value?.toLowerCase())
  vacancy?: string;

  @ApiProperty({
    description: 'ID города',
    example: 'ID города',
  })
  @IsNumber()
  @IsOptional()
  city_id: number;

  @ApiProperty({
    description: 'Зарплата от',
    example: 10000,
  })
  @IsNumber()
  @IsOptional()
  salary_from?: number;

  @ApiProperty({
    description: 'Зарплата до',
    example: 10000,
  })
  @IsNumber()
  @IsOptional()
  salary_to?: number;
}
