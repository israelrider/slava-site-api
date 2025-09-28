import { MaxLength, IsNotEmpty, IsEmail, IsString, IsEnum } from 'class-validator';

import { Role } from '@/iam/enums/roles.enum'

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  readonly name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly email: string;

  @IsEnum(Role)
  readonly role: Role;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;
}
