import { CanActivate, ExecutionContext, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

import { TYPE_TOKEN_BEARER } from '@/iam/iam.constants';
import { JWTPayload } from '@/iam/interfaces/jwt-payload.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      Logger.log(`No token found in ${request.method} request ${request.url}`, 'AccessTokenGuard');
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, 'No token');
    }

    try {
      const payload: JWTPayload = await this.jwtService.verifyAsync(token);
      // Pass user roles to the next roles guard.
      request.headers.role = payload?.role;
    } catch (err) {
      Logger.error('Error verifying token', err);
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, err);
    }

    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === TYPE_TOKEN_BEARER ? token : undefined;
  }
}
