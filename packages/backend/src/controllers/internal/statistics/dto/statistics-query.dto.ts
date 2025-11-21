import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class StatisticsQueryDto {
  @ApiProperty({
    description: 'Период в днях',
    example: 10,
  })
  @IsNumber()
  @Max(360)
  @Min(1)
  period?: number;
}
