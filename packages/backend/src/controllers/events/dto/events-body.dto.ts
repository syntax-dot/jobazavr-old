import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class EventsBody {
  @ApiProperty({
    description: 'Идентификатор ивента',
    example: 'create_profile',
  })
  @IsString()
  @Length(1, 64)
  event_key: string;

  @ApiProperty({
    description: 'Данные ивента',
    example: '',
  })
  @IsString()
  @Length(1, 512)
  event_data: string;
}
