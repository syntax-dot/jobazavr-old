import { Module } from '@nestjs/common';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubForms } from 'src/entities/club-forms.entity';
import { Citizenships } from 'src/entities/citizenships.entity';

@Module({
  controllers: [ClubController],
  providers: [ClubService],
  imports: [TypeOrmModule.forFeature([ClubForms, Citizenships])],
})
export class ClubModule {}
