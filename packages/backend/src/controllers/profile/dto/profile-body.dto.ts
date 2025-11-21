import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  Length,
  Max,
  Min,
} from 'class-validator';

export class ProfilePatchBody {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Никита Балин',
  })
  @IsOptional()
  @Length(1, 256)
  name: string;

  @ApiProperty({
    description: 'Телефон пользователя',
    example: '79123456789',
  })
  @IsOptional()
  @Length(1, 11)
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({
    description: 'Телефон пользователя',
    example: '79123456789',
  })
  @IsOptional()
  @IsNumber()
  city_id: number;

  @ApiProperty({
    description: 'Пол пользователя',
    example: 1,
  })
  @IsOptional()
  @Min(1)
  @Max(2)
  sex: number;

  @ApiProperty({
    description: 'Возраст пользователя',
    example: 18,
  })
  @IsOptional()
  @Min(18)
  @Max(99)
  age: number;

  @ApiProperty({
    description: 'Идентификатор гражданства пользователя',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  citizenship_id: number;

  @ApiProperty({
    description: 'Признак прохождения онбординга',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  onboarding: boolean;

  @ApiProperty({
    description: 'Признак прохождения первого обучения',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  first_training: boolean;

  @ApiProperty({
    description: 'Уведомления от приложения',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  notifications: boolean;
}
