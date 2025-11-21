import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class AuthBody {
  @ApiProperty({
    description: 'Телефон пользователя',
    example: '79123456789',
  })
  @Length(1, 11)
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({
    description: 'Код подтверждения',
    example: '123456',
  })
  @Length(6, 6)
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty({
    description: 'Имя организации',
    example: 'Никита Балин',
  })
  @IsOptional()
  @Length(1, 128)
  organization_name: string;
}

export class RefreshBody {
  @ApiProperty({
    description: 'refresh_token пользователя',
    example: 'refresh_token',
  })
  @IsString()
  @Length(10, 400)
  refresh_token: string;
}
