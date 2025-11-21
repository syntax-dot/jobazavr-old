import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { GetDataDto } from 'src/dto/get-data.dto';
import { AdminCompaniesData } from './dto/companies-data.dto';

@ApiTags('Админ-панель: Модуль управления компаниями')
@Controller('admin/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение списка компаний',
  })
  @ApiResponse({
    status: 200,
    type: AdminCompaniesData,
    isArray: true,
  })
  async getCompanies(
    @Query() query: GetDataDto,
  ): Promise<AdminCompaniesData[]> {
    return await this.companiesService.getCompanies(query);
  }
}
