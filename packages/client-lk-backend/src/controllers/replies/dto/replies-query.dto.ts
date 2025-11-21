import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class RepliesQueryGetDto {
  @ApiProperty({
    description: 'ID компании',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  company_id?: number;
}
