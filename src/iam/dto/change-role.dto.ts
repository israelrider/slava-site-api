import { PickType } from '@nestjs/swagger';

import { UserDto } from '@/users/dto/user.dto';

export class ChangeRoleDto extends PickType(UserDto, ['role'] as const) {}
