import { ApiProperty } from '@nestjs/swagger';

export class StatisticsData {
  @ApiProperty({
    description: 'External ID вакансии',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Количество просмотров вакансии',
    example: 1,
  })
  views: number;

  @ApiProperty({
    description: 'Количество откликов на вакансию',
    example: 1,
  })
  replies: number;
}
