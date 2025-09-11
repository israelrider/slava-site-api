import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Argon2Service } from '@/common/hashing/argon2.service';
import { HashingService } from '@/common/hashing/hashing.service';
import { User } from '@/users/models/user.model';
import { UsersService } from '@/users/users.service';
import { provideUsersRepository } from '@/users/repositories/users.repository.provider';

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
  ],
  controllers: [LoginController],
  providers: [
    {
      provide: HashingService,
      useClass: Argon2Service,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    LoginService,
    UsersService,
    ...provideUsersRepository(),
  ],
})
export class LoginModule {}
