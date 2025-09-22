import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from '@/common/mailer/mailer.module';
import { User } from '@/users/models/user.model';
import { UsersModule } from '@/users/users.module';

import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    MailerModule,
  ],
  controllers: [ChangePasswordController],
  providers: [
    ChangePasswordService,
  ],
})
export class ChangePasswordModule {}
