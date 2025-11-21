import { Module } from '@nestjs/common';
import { CodeCleanerService } from './code-cleaner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Codes } from 'src/entities/codes.entity';

@Module({
  providers: [CodeCleanerService],
  imports: [TypeOrmModule.forFeature([Codes])],
})
export class CodeCleanerModule {}
