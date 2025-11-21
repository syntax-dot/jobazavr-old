import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RepliesModule } from './replies/replies.module';
import { ParserModule } from './parser/parser.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [UserModule, RepliesModule, ParserModule, JobsModule],
})
export class AdminModule {}
