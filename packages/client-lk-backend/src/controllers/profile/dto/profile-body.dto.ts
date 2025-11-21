import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class ProfilePatchBody {
  @ApiProperty({
    description: 'Имя организации',
    example: 'Никита Балин',
  })
  @IsOptional()
  @Length(1, 128)
  organization_name: string;

  @ApiProperty({
    description: 'Телефон пользователя',
    example: '79123456789',
  })
  @IsOptional()
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
  code?: string;
}
