import { PickType } from '@nestjs/swagger';

import { RegisterUserDto } from '@/iam/dto/register-user.dto';

export class LoginDto extends PickType(RegisterUserDto, ['email', 'password'] as const) {}
