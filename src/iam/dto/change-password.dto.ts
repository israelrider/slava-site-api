import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator'

import { RegisterUserDto } from '@/iam/dto/register-user.dto';

export class ChangePasswordDto extends PickType(RegisterUserDto, ['password'] as const) {
  @IsString()
  @IsNotEmpty()
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{6,36}$/u, {
    message: 'Password must be between 6 and 36 characters long, contain at least one uppercase letter, one lowercase letter and one digit.',
  })
  oldPassword: string;
}
