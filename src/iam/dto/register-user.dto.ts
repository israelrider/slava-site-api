import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class RegisterUserDto {
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
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{6,36}$/u, {
    message: 'Password must be between 6 and 36 characters long, contain at least one uppercase letter, one lowercase letter and one digit.',
  })
  password: string;
}
