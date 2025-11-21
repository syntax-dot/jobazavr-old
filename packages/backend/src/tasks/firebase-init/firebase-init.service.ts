import { Injectable } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';
import * as appRoot from 'app-root-path';

@Injectable()
export class FirebaseInitService {
  constructor() {
    // this.handleCron();
  }

  async handleCron() {
    const config = JSON.parse(
      fs.readFileSync(
        `${appRoot}/jobazavr-91702-firebase-adminsdk-yhwf7-771638f77e.json`,
        'utf8',
      ),
    );

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(config),
    });
  }
}
