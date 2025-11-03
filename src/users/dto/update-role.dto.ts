import { IsEnum } from 'class-validator';

import { Role } from '@/iam/enums/roles.enum';

export class UpdateRoleDto {
  @IsEnum(Role)
  readonly role: Role;
}
