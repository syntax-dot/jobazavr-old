import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class LegalAidBody {
  @ApiProperty({
    description: 'Запрос пользователя',
    example: 'Помогите мне',
  })
  @Length(1, 256)
  text: string;
}
