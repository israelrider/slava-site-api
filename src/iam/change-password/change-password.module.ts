import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from '@/common/mailer/mailer.module';
import { Argon2Service } from '@/common/hashing/argon2.service';
import { HashingService } from '@/common/hashing/hashing.service';
import { AuthenticationGuard } from '@/iam/login/guards/authentication/authentication.guard';
import { AccessTokenGuard } from '@/iam/login/guards/access-token/access-token.guard';
import { User } from '@/users/models/user.model';
import { UsersService } from '@/users/users.service';
import { provideUsersRepository } from '@/users/repositories/users.repository.provider';

import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule
  ],
  controllers: [ChangePasswordController],
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
    ChangePasswordService,
    UsersService,
    JwtService,
    ...provideUsersRepository(),
  ],
})
export class ChangePasswordModule {}
