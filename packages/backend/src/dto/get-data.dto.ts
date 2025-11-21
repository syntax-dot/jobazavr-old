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

export class GetDataDto {
  @ApiProperty({
    description: 'Лимит',
    example: 50,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(1000)
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Отступ',
    example: 10,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  offset?: number;

  @ApiProperty({
    description: 'Поисковый запрос',
    example: 'Заметка',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 128)
  @Transform(({ value }) => value?.trim())
  @Transform(({ value }) => value?.toLowerCase())
  query?: string;
}
