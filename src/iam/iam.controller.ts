import { Controller, Post, Body, Req, Res, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth, ApiOperation, ApiBadRequestResponse } from '@nestjs/swagger';
import { TokenExpiredError, } from '@nestjs/jwt';
import { FastifyRequest, FastifyReply } from 'fastify';

import { AuthResponse } from '@/iam/interfaces/auth-response.interface';
import { LoginDto } from '@/iam/dto/login.dto';
import { ChangePasswordDto } from '@/iam/dto/change-password.dto';
import { ForgotPasswordDto } from '@/iam/dto/forgot-password.dto';
import { RegisterUserDto } from '@/iam/dto/register-user.dto'
import { AuthType } from '@/iam/enums/auth-type.enum';
import { Auth } from '@/iam/decorators/auth.decorator';
import { IamService } from '@/iam/iam.service';
import { setCookieOptions } from '@/iam/iam.constants';

@Auth(AuthType.None)
@ApiTags('auth')
@Controller('auth')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ description: 'Registered a new user and sent a confirmation email to the user.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async register(@Body() registerUserDto: RegisterUserDto): Promise<void> {
    try {
      await this.iamService.register(registerUserDto);
    } catch (error) {
      Logger.error(`User registration failed for email ${registerUserDto.email}`, error, 'IamController');
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('email-confirmation')
  @ApiOperation({ summary: 'The service handles token validation and database update.' })
  @ApiOkResponse({ description: 'Confirmed user email using the verification token.' })
  async confirmEmail(@Body('token') token: string): Promise<void> {
    try {
      await this.iamService.confirmEmail(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('Token has expired, please repeat the registration process.', HttpStatus.BAD_REQUEST);
      }

      Logger.error('Email confirmation failed', error, 'IamController');
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({ description: 'Authentication a user with email and password credentials and return token.' })
  public async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: FastifyReply): Promise<AuthResponse> {
    try {
      const result: AuthResponse = await this.iamService.login(loginDto);
      // Set HttpOnly cookie
      response.setCookie('refreshToken', result.refreshToken, setCookieOptions);

      return {
        ...result,
        // Remove refresh token from response body
        refreshToken: undefined,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiOkResponse({ description: 'Logout Implementation' })
  public logout(@Res({ passthrough: true }) response: FastifyReply): void {
    // Clear HttpOnly cookie.
    response.clearCookie('refreshToken', setCookieOptions);
  }

  @Post('refresh-tokens')
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiOkResponse({ description: 'Refresh tokens and return new tokens' })
  public async refreshTokens(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply): Promise<AuthResponse> {
    const result: AuthResponse = await this.iamService.refreshTokens(request?.cookies?.refreshToken);
    // Set HttpOnly cookie
    response.setCookie('refreshToken', result.refreshToken, setCookieOptions);

    return {
      ...result,
      // Remove refresh token from response body
      refreshToken: undefined,
    };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request Reset Password' })
  @ApiOkResponse({ description: 'Password has been reset and send a confirmation email to the user.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    try {
      await this.iamService.forgotPassword(forgotPasswordDto);
    } catch (error) {
      Logger.error(`Creating new password failed for email ${forgotPasswordDto.email}`, error, 'IamController');
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Auth(AuthType.Bearer)
  @Post('change-password')
  @ApiOperation({ summary: 'Request Change Password' })
  @ApiOkResponse({ description: 'Password has been changed and send a confirmation email to the user.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async changePassword(@Req() request: FastifyRequest, @Body() changePasswordDto: ChangePasswordDto): Promise<void> {
    const userId: string = request.headers.id as string;
    await this.iamService.changePassword(+userId, changePasswordDto);
  }
}
