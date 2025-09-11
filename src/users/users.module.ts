import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from '@/common/mailer/mailer.module';
import { Argon2Service } from '@/common/hashing/argon2.service';
import { HashingService } from '@/common/hashing/hashing.service';

import { User } from './models/user.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { provideUsersRepository } from './repositories/users.repository.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: HashingService,
      useClass: Argon2Service,
    },
    UsersService,
    ...provideUsersRepository(),
  ],
})
export class UsersModule {}
