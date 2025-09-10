import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, Post, Body, HttpCode, Req, Res, BadRequestException } from '@nestjs/common';
import { ApiUnauthorizedResponse, ApiOkResponse, ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { LoginDto } from '@/iam/login/dto/login.dto';

import { LoginService } from './login.service';
import { AuthType } from './enums/auth-type.enum';
import { AuthGuard } from './decorators/auth-guard.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { setCookieOptions } from './utils';

@ApiTags('auth')
@AuthGuard(AuthType.None)
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({
    description: 'Authentication a user with email and password credentials and return token',
  })
  @ApiUnauthorizedResponse({ description: 'Forbidden' })
  public async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: FastifyReply): Promise<AuthResponse> {
    const result: AuthResponse = await this.loginService.login(loginDto);

    // Set HttpOnly cookie
    response.setCookie('refreshToken', result.refreshToken, setCookieOptions);

    return {
      ...result,
      // Remove refresh token from response body
      refreshToken: undefined,
    };
  }

  @Post('refresh-tokens')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Refresh tokens and return new tokens',
  })
  @ApiUnauthorizedResponse({ description: 'Forbidden' })
  public async refreshTokens(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply): Promise<AuthResponse> {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken || !refreshToken.length) {
      throw new BadRequestException('The refreshToken had not been found..');
    }

    const refreshTokenDto = new RefreshTokenDto();
    refreshTokenDto.refreshToken = refreshToken;
    const result: AuthResponse = await this.loginService.refreshTokens(refreshTokenDto);

    // Set HttpOnly cookie
    response.setCookie('refreshToken', result.refreshToken, setCookieOptions);

    return {
      ...result,
      // Remove refresh token from response body
      refreshToken: undefined,
    };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout a user' })
  @ApiOkResponse({
    description: 'Logout Implementation',
  })
  public logout(@Res({ passthrough: true }) response: FastifyReply): { message: string } {
    // Clear HttpOnly cookie.
    response.clearCookie('refreshToken', setCookieOptions);

    return {
      message: 'Logout successful',
    };
  }
}
