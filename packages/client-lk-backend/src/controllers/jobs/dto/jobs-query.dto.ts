import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

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
    description: 'Период в днях',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  @Max(360)
  @Min(1)
  period?: number;

  @ApiProperty({
    description: 'ID компании',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  company_id?: number;
}

export class JobsQueryDeleteDto {
  @ApiProperty({
    description: 'ID компании',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  company_id?: number;
}
