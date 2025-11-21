import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';

@Injectable()
export class InternalFilesCleanerService {
  @Cron('* * * * *')
  async handleCron() {
    const files = fs.readdirSync(`${process.env.PWD}/static/internal/`);

    for await (const file of files) {
      const { birthtime } = fs.statSync(
        `${process.env.PWD}/static/internal/${file}`,
      );

      if (new Date().getTime() - birthtime.getTime() > 1000 * 60 * 5) {
        try {
          fs.unlinkSync(`${process.env.PWD}/static/internal/${file}`);
        } catch {}
      }
    }
  }
}
