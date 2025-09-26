import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@/iam/decorators/roles.decorator';
import { Role } from '@/iam/enums/roles.enum';
import { FastifyRequest } from 'fastify';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (!requiredRoles) {
      // No roles specified, allow access?????????????????????????????????????
      Logger.error('No roles specified, so access denied');
      return false;
    }

    const request: FastifyRequest = context.switchToHttp().getRequest();
    // Assuming 'user' object is populated by a previous JWT AuthGuard
    // and 'user.roles' is an array of roles for the user.
    const myrole = request.headers.role;

    // return requiredRoles.some((role: Role) => user.roles?.includes(role));
    return requiredRoles.some((role: Role) => myrole === role);
  }
}
