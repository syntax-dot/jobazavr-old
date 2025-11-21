import { Module } from '@nestjs/common';
import { FirebaseInitService } from './firebase-init.service';

@Module({
  providers: [FirebaseInitService],
})
export class FirebaseInitModule {}
