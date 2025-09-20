import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { IamModule } from '@/iam/iam.module';
import { AuthenticationGuard } from '@/iam/login/guards/authentication/authentication.guard';
import { AccessTokenGuard } from '@/iam/login/guards/access-token/access-token.guard';
import { RolesGuard } from '@/iam/login/guards/roles/roles.guard';
import { jwtConfig } from '@/iam/login/config/jwt.config';
import { ProtectedModule } from '@/protected/protected.module';

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
    IamModule,
    ProtectedModule,
  ],
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
