import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Citizenships } from 'src/entities/citizenships.entity';
import { CitizenshipsController } from './citizenships.controller';
import { CitizenshipsService } from './citizenships.service';

@Module({
  controllers: [CitizenshipsController],
  providers: [CitizenshipsService],
  imports: [TypeOrmModule.forFeature([Citizenships])],
})
export class CitizenshipsModule {}
