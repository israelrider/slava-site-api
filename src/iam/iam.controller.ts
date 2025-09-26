import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, Post, Put, Body, HttpCode, Req, Res, BadRequestException, UnauthorizedException, Logger, HttpStatus } from '@nestjs/common';
import { ApiUnauthorizedResponse, ApiOkResponse, ApiTags, ApiBearerAuth, ApiOperation, ApiBadRequestResponse } from '@nestjs/swagger';
import { TokenExpiredError } from '@nestjs/jwt';

import { ChangePasswordResponse } from '@/iam/interfaces/change-password-response.interface';
import { ForgotPasswordResponse } from '@/iam/interfaces/forgot-password-response.interface';
import { AuthResponse } from '@/iam/interfaces/auth-response.interface';
import { LoginDto } from '@/iam/dto/login.dto';
import { ChangePasswordDto } from '@/iam/dto/change-password.dto';
import { ForgotPasswordDto } from '@/iam/dto/forgot-password.dto';
import { RefreshTokenDto } from '@/iam/dto/refresh-token.dto';
import { AuthType } from '@/iam/enums/auth-type.enum';
import { Auth } from '@/iam/decorators/auth.decorator';
import { IamService } from '@/iam/iam.service';
import { setCookieOptions } from '@/iam/utils';

@ApiTags('auth')
@Auth(AuthType.None)
@Controller('auth')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({
    description: 'Authentication a user with email and password credentials and return token',
  })
  @ApiUnauthorizedResponse({ description: 'Forbidden' })
  public async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: FastifyReply): Promise<AuthResponse> {
    const result: AuthResponse = await this.iamService.login(loginDto);

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

    let result: AuthResponse = null;
    try {
      result = await this.iamService.refreshTokens(refreshTokenDto);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // You might throw a custom exception or return a specific error response
        throw new UnauthorizedException(`Authentication token expired. ${error.message}`);
      }

      Logger.error('Error during token refresh', error);
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!result || !result.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Set HttpOnly cookie
    response.setCookie('refreshToken', result.refreshToken, setCookieOptions);

    return {
      ...result,
      // Remove refresh token from response body
      refreshToken: undefined,
    };
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request Reset Password' })
  @ApiOkResponse({
    description: 'Request Reset Password and send a confirmation email to the user',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    try {
      await this.iamService.forgotPassword(forgotPasswordDto);

      return {
        message: 'Request Reset Password Successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: Forgot password failed!');
    }
  }

  @Post('change-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request Change Password' })
  @ApiOkResponse({
    description: 'Request Change Password and send a confirmation email to the user',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<ChangePasswordResponse> {
    try {
      await this.iamService.changePassword(changePasswordDto);

      return {
        message: 'Request Change Password Successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: Change password failed!');
    }
  }

  @Put('change-role')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request Change Role' })
  @ApiOkResponse({
    description: 'Request Change Role',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async changeRole(@Body() changePasswordDto: ChangePasswordDto): Promise<ChangePasswordResponse> {
    try {
      await this.iamService.changePassword(changePasswordDto);

      return {
        message: 'Request Change Password Successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: Change password failed!');
    }
  }
}
