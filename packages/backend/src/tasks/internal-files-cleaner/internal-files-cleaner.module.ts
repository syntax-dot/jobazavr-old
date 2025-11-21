import { Module } from '@nestjs/common';
import { InternalFilesCleanerService } from './internal-files-cleaner.service';

@Module({
  providers: [InternalFilesCleanerService],
})
export class InternalFilesCleanerModule {}
