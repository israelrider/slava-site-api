import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from '@/common/mailer/mailer.module';
import { User } from '@/users/models/user.model';
import { UsersModule } from '@/users/users.module';

import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule,
    UsersModule,
  ],
  controllers: [RegisterController],
  providers: [
    RegisterService,
  ],
})
export class RegisterModule {}
