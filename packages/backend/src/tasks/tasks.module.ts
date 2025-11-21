import { Module } from '@nestjs/common';
import { CitiesModule } from './cities/cities.module';
import { JobsParserModule } from './jobs-parser/jobs-parser.module';
import { RepliesModule } from './replies/replies.module';
import { TokenRefreshModule } from './token-refresh/token-refresh.module';
import { UsersExportModule } from './users-export/users-export.module';
import { CodeCleanerModule } from './code-cleaner/code-cleaner.module';
import { FirebaseInitModule } from './firebase-init/firebase-init.module';
import { CreatedUsersExportToBitrixModule } from './created-users-export-to-bitrix/created-users-export-to-bitrix.module';
import { InternalFilesCleanerModule } from './internal-files-cleaner/internal-files-cleaner.module';

@Module({
  imports: [
    CitiesModule,
    JobsParserModule,
    RepliesModule,
    TokenRefreshModule,
    UsersExportModule,
    CodeCleanerModule,
    FirebaseInitModule,
    CreatedUsersExportToBitrixModule,
    InternalFilesCleanerModule,
  ],
})
export class TasksModule {}
