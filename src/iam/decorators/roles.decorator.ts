import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { Role } from '@/iam/enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles: (...roles: Role[]) => CustomDecorator<string> = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
