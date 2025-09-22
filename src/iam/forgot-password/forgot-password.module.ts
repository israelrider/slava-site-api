import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from '@/common/mailer/mailer.module';
import { UtilsModule } from '@/common/utils/utils.module';
import { User } from '@/users/models/user.model';
import { UsersModule } from '@/users/users.module';

import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    MailerModule,
    UtilsModule,
  ],
  controllers: [ForgotPasswordController],
  providers: [
    ForgotPasswordService,
  ],
})
export class ForgotPasswordModule {}
