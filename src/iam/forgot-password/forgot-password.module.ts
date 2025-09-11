import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Argon2Service } from '@/common/hashing/argon2.service';
import { HashingService } from '@/common/hashing/hashing.service';
import { MailerModule } from '@/common/mailer/mailer.module';
import { UtilsModule } from '@/common/utils/utils.module';
import { User } from '@/users/models/user.model';
import { provideUsersRepository } from '@/users/repositories/users.repository.provider';
import { UsersService } from '@/users/users.service';

import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailerModule, UtilsModule],
  providers: [
    {
      provide: HashingService,
      useClass: Argon2Service,
    },
    ForgotPasswordService,
    UsersService,
    ...provideUsersRepository(),
  ],
  controllers: [ForgotPasswordController],
})
export class ForgotPasswordModule {}
