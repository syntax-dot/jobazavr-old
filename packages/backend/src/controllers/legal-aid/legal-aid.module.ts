import { Module } from '@nestjs/common';
import { LegalAidController } from './legal-aid.controller';
import { LegalAidService } from './legal-aid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Citizenships } from 'src/entities/citizenships.entity';

@Module({
  controllers: [LegalAidController],
  providers: [LegalAidService],
  imports: [TypeOrmModule.forFeature([Citizenships])],
})
export class LegalAidModule {}
