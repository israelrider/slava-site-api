import { PickType } from '@nestjs/swagger';

import { UserDto } from '@/users/dto/user.dto';

// prettier-ignore
export class LoginDto extends PickType(UserDto, [
  'email',
  'password',
] as const) {}
