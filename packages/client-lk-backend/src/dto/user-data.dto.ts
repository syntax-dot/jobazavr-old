import { ApiProperty } from '@nestjs/swagger';

export class UserDataDto {
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Имя и фамилия пользователя',
    example: 'Никита Балин',
  })
  organization_name: string;

  @ApiProperty({
    description: 'Номер телефона пользователя',
    example: '79999999999',
  })
  phone: string;

  @ApiProperty({
    description: 'Является ли пользователь администратором',
    example: false,
  })
  is_admin: boolean;

  @ApiProperty({
    description: 'Дата последнего обновления данных пользователя (timestamp)',
    example: 1610000000,
  })
  updated_at: number;

  @ApiProperty({
    description: 'Дата регистрации пользователя (timestamp)',
    example: 1610000000,
  })
  joined_at: number;
}
