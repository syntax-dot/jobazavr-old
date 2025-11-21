import { ApiProperty } from '@nestjs/swagger';

export class CitiesData {
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
    description: 'Широта',
    example: 55.753215,
  })
  latitude: number;

  @ApiProperty({
    description: 'Долгота',
    example: 37.622504,
  })
  longitude: number;
}
