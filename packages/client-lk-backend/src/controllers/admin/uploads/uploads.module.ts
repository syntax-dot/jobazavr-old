import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uploads } from 'src/entities/uploads.entity';
import { Users } from 'src/entities/users.entity';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
  imports: [TypeOrmModule.forFeature([Uploads, Users])],
})
export class UploadsModule {}
