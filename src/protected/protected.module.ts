import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { CatsController } from '@/protected/cats.controller';
import { CatsService } from '@/protected/cats.service';
import { HashingService } from '@/common/hashing/hashing.service';
import { Argon2Service } from '@/common/hashing/argon2.service';
import { AuthenticationGuard } from '@/iam/login/guards/authentication/authentication.guard';
import { AccessTokenGuard } from '@/iam/login/guards/access-token/access-token.guard';
import { RolesGuard } from '@/iam/login/guards/roles/roles.guard';

@Module({
  controllers: [CatsController],
  providers: [
    {
      provide: HashingService,
      useClass: Argon2Service,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    CatsService,
    AccessTokenGuard,
    //ChangePasswordService,
    //UsersService,
    JwtService,
  ],
})
export class ProtectedModule {}
