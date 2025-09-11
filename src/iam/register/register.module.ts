import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Argon2Service } from '@/common/hashing/argon2.service';
import { HashingService } from '@/common/hashing/hashing.service';
import { MailerModule } from '@/common/mailer/mailer.module';
import { User } from '@/users/models/user.model';
import { UsersService } from '@/users/users.service';
import { provideUsersRepository } from '@/users/repositories/users.repository.provider';

import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule
  ],
  controllers: [RegisterController],
  providers: [
    {
      provide: HashingService,
      useClass: Argon2Service,
    },
    RegisterService,
    UsersService,
    ...provideUsersRepository(),
  ],
})
export class RegisterModule {}
