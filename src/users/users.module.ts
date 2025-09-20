import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from '@/common/mailer/mailer.module';
import { Argon2Service } from '@/common/hashing/argon2.service';
import { HashingService } from '@/common/hashing/hashing.service';
import { User } from '@/users/models/user.model';
import { UsersService } from '@/users/users.service';
import { provideUsersRepository } from '@/users/repositories/users.repository.provider';
import { UsersController } from '@/users/users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule,
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
  exports: [
    {
      provide: HashingService,
      useClass: Argon2Service,
    },
    UsersService,
    ...provideUsersRepository(),
  ],
})
export class UsersModule {}
