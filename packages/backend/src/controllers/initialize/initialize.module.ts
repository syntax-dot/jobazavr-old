import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Citizenships } from 'src/entities/citizenships.entity';
import { InitializeController } from './initialize.controller';
import { InitializeService } from './initialize.service';
import { Cities } from 'src/entities/cities.entity';

@Module({
  controllers: [InitializeController],
  providers: [InitializeService],
  imports: [TypeOrmModule.forFeature([Citizenships, Cities])],
})
export class InitializeModule {}
