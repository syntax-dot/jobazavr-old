import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from 'src/entities/cities.entity';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService],
  imports: [TypeOrmModule.forFeature([Cities])],
})
export class CitiesModule {}
