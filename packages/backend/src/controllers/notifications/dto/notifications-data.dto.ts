import { ApiProperty } from '@nestjs/swagger';

export class OrdersGetData {
  @ApiProperty({
    description: 'Идентификатор устройства',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Лейбл устройства',
    example: 'iPhone 14 Pro',
  })
  label: string;

  @ApiProperty({
    description: 'Дата добавления устройства',
    example: 1,
  })
  created_at: number;
}
