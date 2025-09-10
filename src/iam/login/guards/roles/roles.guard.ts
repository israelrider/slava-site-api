import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@/iam/login/decorators/roles.decorator';
import { Role } from '@/iam/login/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass()
      ]
    );

    if (!requiredRoles) {
      // No roles specified, allow access.
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    // Assuming 'user' object is populated by a previous JWT AuthGuard
    // and 'user.roles' is an array of roles for the user.

    return requiredRoles.some((role: Role) => user.roles?.includes(role));
  }
}
