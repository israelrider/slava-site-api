import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

import { TYPE_TOKEN_BEARER, ROLE, } from '@/iam/iam.constants';
import { JWTPayload } from '@/iam/login/interfaces/jwt-payload.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: JWTPayload = await this.jwtService.verifyAsync(token);
      // Pass user roles to the next roles guard.
      request.headers[ROLE] = payload?.role;
    } catch (err) {
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, err);
    }

    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === TYPE_TOKEN_BEARER ? token : undefined;
  }
}
