import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { IamModule } from '@/iam/iam.module';
import { AuthenticationGuard } from '@/iam/guards/authentication.guard';
import { AccessTokenGuard } from '@/iam/guards/access-token.guard';
import { RolesGuard } from '@/iam/guards/roles.guard';
import { jwtConfig } from '@/iam/config/jwt.config';
import { UtilsModule } from '@/common/utils/utils.module';
import { WeatherModule } from '@/weather/weather.module';
import { AskFromModule } from '@/ask-from/askFrom.module';
import { DiaryModule } from '@/diary/diary.module';
import { FeedbackModule } from '@/feedback/feedback.module';
import { FilesModule } from "@/files/files.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.TYPEORM_HOST,
        port: process.env.TYPEORM_PORT ? parseInt(process.env.TYPEORM_PORT, 10) : 3306,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        synchronize: true,
        entities: [__dirname + '/**/*.{model,entity}.{ts,js}'],
        migrations: ['dist/migrations/**/*.js'],
        subscribers: ['dist/subscriber/**/*.js'],
        cli: {
          migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
          subscribersDir: process.env.TYPEORM_SUBSCRIBERS_DIR,
        },
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: jwtConfig.secret,
        audience: jwtConfig.audience,
        issuer: jwtConfig.issuer,
      }),
    }),
    UtilsModule,
    IamModule,
    WeatherModule,
    AskFromModule,
    DiaryModule,
    FeedbackModule,
    FilesModule,
  ],
  // Apply guards globally, to each incoming request.
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    RolesGuard,
  ],
})
export class AppModule {}
