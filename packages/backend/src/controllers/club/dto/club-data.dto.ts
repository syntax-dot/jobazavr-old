import { ApiProperty } from '@nestjs/swagger';

export class ClubData {
  @ApiProperty({
    description: 'Идентификатор карты клуба',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Никита Балин',
  })
  name: string;

  @ApiProperty({
    description: 'Дата окончания',
    example: 1,
  })
  expires_at: number;
}
