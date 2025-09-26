import { UserDto } from '@/users/dto/user.dto';
import { OmitType } from '@nestjs/swagger';

export class RegisterUserDto extends OmitType(UserDto, ['role'] as const) {}
