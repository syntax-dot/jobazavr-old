import { ApiProperty } from '@nestjs/swagger';

export class InitializeData {
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
    description: 'Дата регистрации',
    example: 1610000000,
  })
  created_at: number;

  @ApiProperty({
    description: 'Является ли пользователь администратором',
    example: false,
  })
  is_admin: boolean;
}
