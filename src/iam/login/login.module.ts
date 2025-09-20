import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/users/models/user.model';
import { UsersModule } from '@/users/users.module';

import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
  ],
  controllers: [LoginController],
  providers: [
    LoginService,
  ],
})
export class LoginModule {}
