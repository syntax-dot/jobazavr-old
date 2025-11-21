import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedFiles } from 'src/entities/uploaded-files.entity';
import { ParserController } from './parser.controller';
import { ParserService } from './parser.service';

@Module({
  controllers: [ParserController],
  providers: [ParserService],
  imports: [TypeOrmModule.forFeature([UploadedFiles])],
})
export class ParserModule {}
