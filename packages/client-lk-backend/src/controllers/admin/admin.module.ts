import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [CompaniesModule, UploadsModule],
})
export class AdminModule {}
