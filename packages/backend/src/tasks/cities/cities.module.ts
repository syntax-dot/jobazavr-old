import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from 'src/entities/cities.entity';
import { CitiesService } from './cities.service';

@Module({
  providers: [CitiesService],
  imports: [TypeOrmModule.forFeature([Cities])],
})
export class CitiesModule {}
