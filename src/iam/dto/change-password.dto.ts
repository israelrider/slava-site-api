import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

import { RegisterUserDto } from '@/iam/dto/register-user.dto';

export class ChangePasswordDto extends PickType(RegisterUserDto, ['password'] as const) {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  oldPassword: string;
}
