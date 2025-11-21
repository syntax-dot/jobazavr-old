import { ApiProperty } from '@nestjs/swagger';

export class AdminCompaniesData {
  @ApiProperty({
    description: 'Идентификатор организации',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Название организации',
    example: 'ООО Ромашка',
  })
  organization_name: string;

  @ApiProperty({
    description: 'Номер телефона организации',
    example: '79999999999',
  })
  phone: string;

  @ApiProperty({
    description: 'Дата регистрации',
    example: 1610000000,
  })
  created_at: number;
}
