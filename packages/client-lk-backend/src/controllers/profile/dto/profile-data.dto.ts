import { ApiProperty } from '@nestjs/swagger';

export class ProfileData {
  @ApiProperty({
    description: 'Время отправки кода',
    example: 1234567890,
  })
  sent_at?: number;

  @ApiProperty({
    description: 'Телефон пользователя',
    example: '79123456789',
  })
  phone?: string;

  @ApiProperty({
    description: 'Смс',
    example: '000000',
  })
  code?: string;
}
