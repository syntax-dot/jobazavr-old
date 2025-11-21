import { ApiProperty } from '@nestjs/swagger';

export class CitizenshipsDataDto {
  @ApiProperty({
    description: 'Идентификатор гражданства',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Название гражданства',
    example: 'Россия',
  })
  title: string;
}
