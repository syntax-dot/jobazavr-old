import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResInterceptor } from './interceptors/res.interceptor';
import { ParamsMiddleware } from './middleware/params/params.middleware';
import { StartParamsModule } from './middleware/params/params.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { InitializeModule } from './controllers/initialize/initialize.module';
import { ProfileModule } from './controllers/profile/profile.module';
import { CitizenshipsModule } from './controllers/citizenships/citizenships.module';
import { JobsModule } from './controllers/jobs/jobs.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TasksModule } from './tasks/tasks.module';
import { CitiesModule } from './controllers/cities/cities.module';
import { EventsModule } from './controllers/events/events.module';
import { AdminMiddleware } from './middleware/admin/admin.middleware';
import { AdminModule } from './controllers/admin/admin.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BotModule } from './controllers/bot/bot.module';
import { AuthModule } from './controllers/auth/auth.module';
import { ClubModule } from './controllers/club/club.module';
import { LegalAidModule } from './controllers/legal-aid/legal-aid.module';
import { NotificationsModule } from './controllers/notifications/notifications.module';
import { ExternalMiddleware } from './middleware/external/external.middleware';
import { SubscriptionsModule } from './controllers/subscriptions/subscriptions.module';
import { InternalModule } from './controllers/internal/internal.module';
import { InternalMiddleware } from './middleware/internal/internal.middleware';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    RedisModule.forRoot({
      config:
        process.env.IS_LOCAL_DEV === 'true'
          ? {
              host: 'localhost',
              port: 6379,
            }
          : {
              url: `redis://${process.env.REDIS_URL}`,
            },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 300,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      extra: {
        connectionLimit: +process.env.DB_CONNECTION_LIMIT,
      },
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      charset: 'utf8mb4_general_ci',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/entities/*.entity.{js,ts}'],
      synchronize: true,
      cache: false,
    }),
    StartParamsModule,
    InitializeModule,
    ProfileModule,
    CitizenshipsModule,
    JobsModule,
    TasksModule,
    CitiesModule,
    EventsModule,
    AdminModule,
    BotModule,
    AuthModule,
    ClubModule,
    LegalAidModule,
    NotificationsModule,
    SubscriptionsModule,
    InternalModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ParamsMiddleware)
      .exclude(
        'static/agreement.pdf',
        'static/privacy.pdf',
        'static/privacy.docx',
        'static/club_agreement.pdf',
        'static/club_privacy.pdf',
        'static/internal/(.*)?',
        'jobs/view/(.*)?',
        'external(/.*)?',
        { path: 'jobs(/.*)?', method: RequestMethod.GET },
        'service/(.*)?',
        'external/(.*)?',
        'auth/(.*)?',
        'internal/(.*)?',
        'cities',
      )
      .forRoutes('*');

    consumer
      .apply(AdminMiddleware)
      .exclude(
        'static/agreement.pdf',
        'static/privacy.pdf',
        'static/privacy.docx',
        'static/internal/(.*)?',
        'static/club_agreement.pdf',
        'static/club_privacy.pdf',
      )
      .forRoutes('admin/*', 'static/*');

    consumer.apply(ExternalMiddleware).forRoutes('notifications/(.*)?');

    consumer.apply(InternalMiddleware).forRoutes('internal/*');
  }
}
