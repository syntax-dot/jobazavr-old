import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class ClubPostBody {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'n.balin@koka.team',
  })
  @Length(1, 256)
  @IsEmail()
  email: string;
}
