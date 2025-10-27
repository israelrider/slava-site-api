import { CanActivate, ExecutionContext, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@/iam/decorators/roles.decorator';
import { Role } from '@/iam/enums/roles.enum';
import { FastifyRequest } from 'fastify';
import { UtilsService } from '@/common/utils/utils.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private static readonly defaultRole = Role.Customer;

  constructor(
    private readonly reflector: Reflector,
    private readonly utilsService: UtilsService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the required roles from metadata set by the Roles decorator.
    // For example: @Roles(Role.Admin)
    let requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      // Apply the role requirement by default.
      requiredRoles = [RolesGuard.defaultRole];
    }

    const request: FastifyRequest = context.switchToHttp().getRequest();
    // The "role" property has been added to headers by a previous AccessTokenGuard.
    const currentUserRole = request.headers.role as string;
    if (!this.utilsService.isRole(currentUserRole)) {
      Logger.warn(`Error user role verification: ${currentUserRole} is not a valid role`, 'RolesGuard');
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, 'Invalid role');
    }

    const rolesArray: string[] = Object.values(Role);
    const userRoleIndex: number = rolesArray.indexOf(currentUserRole);

    for (const role of requiredRoles) {
      const requiredRoleIndex: number = rolesArray.indexOf(role.toString());
      if (userRoleIndex < requiredRoleIndex) {
        Logger.warn(`Error verifying token. User role "${currentUserRole}" does not have sufficient permissions.`, 'RolesGuard');
        throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, 'Insufficient permissions');
      }
    }

    return true;
  }
}
