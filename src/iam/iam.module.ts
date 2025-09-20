import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ChangePasswordModule } from './change-password/change-password.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';

@Module({
  imports: [
    LoginModule,
    RegisterModule,
    ForgotPasswordModule,
    ChangePasswordModule,
  ],
  providers: [JwtService],
})
export class IamModule {}
