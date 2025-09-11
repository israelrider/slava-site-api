import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  readonly role: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;
}
