import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from '@/common/mailer/mailer.module';
import { AuthenticationGuard } from '@/iam/login/guards/authentication/authentication.guard';
import { AccessTokenGuard } from '@/iam/login/guards/access-token/access-token.guard';
import { User } from '@/users/models/user.model';
import { UsersModule } from '@/users/users.module';

import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule,
    UsersModule,
  ],
  controllers: [ChangePasswordController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    ChangePasswordService,
    JwtService,
  ],
})
export class ChangePasswordModule {}
