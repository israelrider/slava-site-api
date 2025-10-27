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
    [AuthType.Bearer]: [
      // Currently uses AccessTokenGuard and RolesGuard for Bearer authentication.
      this.accessTokenGuard,
      this.rolesGuard,
    ],
    [AuthType.None]: {
      // No authentication required. This is just a dummy guard that always passes.
      canActivate: () => true,
    },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly rolesGuard: RolesGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve the required authentication types from metadata set by the Auth decorator.
    // For example: @Auth(AuthType.Bearer)
    let authTypes: AuthType[] = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );
    if (!authTypes || authTypes.length === 0) {
      // Apply the authentication requirement by default.
      authTypes = [AuthenticationGuard.defaultAuthType];
    }

    const rawGuards: (CanActivate | CanActivate[])[] = authTypes.map((type: AuthType) => this.authTypeGuardMap[type]);
    const guards: CanActivate[] = rawGuards.flat();

    for (const instance of guards) {
      // Run each guard's canActivate method.
      const canActivate = await Promise.resolve(instance.canActivate(context));

      if (!canActivate) {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
