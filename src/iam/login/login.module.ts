import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/users/models/user.model';
import { UsersModule } from '@/users/users.module';

import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { jwtConfig } from './config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => {
        if (!jwtConfig.secret) {
          throw new Error('JWT_SECRET_KEY not defined');
        }
        return {
          secret: jwtConfig.secret,
          audience: jwtConfig.audience,
          issuer: jwtConfig.issuer,
          expiresIn: jwtConfig.accessTokenTtl,
        };
      },
    }),
    UsersModule,
  ],
  controllers: [LoginController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    LoginService,
  ],
})
export class LoginModule {}
