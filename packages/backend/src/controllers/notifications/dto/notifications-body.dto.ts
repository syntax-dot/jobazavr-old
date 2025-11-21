import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class NotificationsCreateBody {
  @ApiProperty({
    description: 'Токен устройства',
    example: '1234567890',
  })
  @IsString()
  @Length(1, 256)
  token: string;

  @ApiProperty({
    description: 'Лейбл устройства',
    example: '1234567890',
  })
  @IsString()
  @Length(1, 64)
  label: string;
}
