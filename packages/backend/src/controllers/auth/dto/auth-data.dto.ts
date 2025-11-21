import { ApiProperty } from '@nestjs/swagger';

export class AuthData {
  @ApiProperty({
    description: 'Токен доступа',
    example: 'token',
  })
  access_token: string;

  @ApiProperty({
    description: 'Токен обновления',
    example: 'token',
  })
  refresh_token: string;
}

export class AuthDataCode {
  @ApiProperty({
    description: 'Время отправки кода',
    example: 1234567890,
  })
  sent_at: number;

  @ApiProperty({
    description: 'Телефон пользователя',
    example: '79123456789',
  })
  phone: string;

  @ApiProperty({
    description: 'Смс',
    example: '000000',
  })
  code?: string;
}
