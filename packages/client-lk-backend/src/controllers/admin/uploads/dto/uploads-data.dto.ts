import { ApiProperty } from '@nestjs/swagger';

export class AdminUploadsUserData {
  @ApiProperty({
    description: 'Идентификатор файла',
    example: 1,
  })
  readonly id?: number;

  @ApiProperty({
    description: 'Адрес файла',
    example: 'http://localhost:3000/static/...',
  })
  readonly url: string;

  @ApiProperty({
    description: 'Тип файла',
    example: 'image',
  })
  readonly type: string;

  @ApiProperty({
    description: 'Дата загрузки файла',
    example: 1610000000,
  })
  readonly uploaded_at?: number;

  @ApiProperty({
    description: 'Имя файла',
    example: 'image.png',
  })
  readonly file_name?: string;
}
