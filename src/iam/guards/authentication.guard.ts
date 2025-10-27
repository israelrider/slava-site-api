import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthType } from '@/iam/enums/auth-type.enum';
import { AccessTokenGuard } from '@/iam/guards/access-token.guard';
import { RolesGuard } from '@/iam/guards/roles.guard';
import { AUTH_TYPE_KEY } from '@/iam/decorators/auth.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;
  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]> = {
    [AuthType.Bearer]: [this.accessTokenGuard, this.rolesGuard],
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly rolesGuard: RolesGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes: AuthType[] = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ]
    ) ?? [AuthenticationGuard.defaultAuthType];
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(instance.canActivate(context));

      if (canActivate) {
        return true;
      }
    }

    throw new UnauthorizedException();
  }
}
