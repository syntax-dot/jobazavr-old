import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResInterceptor } from './interceptors/res.interceptor';
import { ParamsMiddleware } from './middleware/params/params.middleware';
import { StartParamsModule } from './middleware/params/params.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { InitializeModule } from './controllers/initialize/initialize.module';
import { ProfileModule } from './controllers/profile/profile.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './controllers/auth/auth.module';
import { ParserModule } from './controllers/parser/parser.module';
import { JobsModule } from './controllers/jobs/jobs.module';
import { RepliesModule } from './controllers/replies/replies.module';
import { AdminMiddleware } from './middleware/admin/admin.middleware';
import { AdminModule } from './controllers/admin/admin.module';
import { CitiesModule } from './controllers/cities/cities.module';
import { UploadsModule } from './controllers/uploads/uploads.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 300,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'static'),
      serveRoot: '/static',
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
    UploadsModule,
    AuthModule,
    ParserModule,
    JobsModule,
    TasksModule,
    RepliesModule,
    CitiesModule,
    AdminModule,
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
        'static/jobs-template.xlsx',
        'static/(.*)?',
        'auth/(.*)?',
      )
      .forRoutes('*');

    consumer.apply(AdminMiddleware).forRoutes('admin/*');
  }
}
