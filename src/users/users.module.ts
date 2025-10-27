import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerService } from '@/common/mailer/mailer.service'
import { Argon2Service } from '@/common/hashing/argon2.service';
import { HashingService } from '@/common/hashing/hashing.service';
import { UtilsService } from '@/common/utils/utils.service';
import { User } from '@/users/models/user.model';
import { UsersService } from '@/users/users.service';
import { provideUsersRepository } from '@/users/repositories/users.repository.provider';
import { UsersController } from '@/users/users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [
    UtilsService,
    MailerService,
    {
      provide: HashingService,
      useClass: Argon2Service,
    },
    UsersService,
    ...provideUsersRepository(),
  ],
  exports: [
    UtilsService,
    MailerService,
    {
      provide: HashingService,
      useClass: Argon2Service,
    },
    UsersService,
    ...provideUsersRepository(),
  ],
})
export class UsersModule {}
