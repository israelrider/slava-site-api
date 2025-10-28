import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

import { UserDto } from '@/users/dto/user.dto';

export class ChangePasswordDto extends PickType(UserDto, ['password'] as const) {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  oldPassword: string;
}
