import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class UploadQueryDto {
  @ApiProperty({
    description: 'Тип',
    example: 'document',
    required: true,
  })
  @IsIn(['document', 'finance'])
  @IsString()
  type: string;
}
