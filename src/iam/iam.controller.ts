import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth, ApiOperation, ApiBadRequestResponse } from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';

import { ChangePasswordResponse } from '@/iam/interfaces/change-password-response.interface';
import { ForgotPasswordResponse } from '@/iam/interfaces/forgot-password-response.interface';
import { AuthResponse } from '@/iam/interfaces/auth-response.interface';
import { LoginDto } from '@/iam/dto/login.dto';
import { ChangePasswordDto } from '@/iam/dto/change-password.dto';
import { ForgotPasswordDto } from '@/iam/dto/forgot-password.dto';
import { RegisterUserDto } from '@/iam/dto/register-user.dto'
import { AuthType } from '@/iam/enums/auth-type.enum';
import { Role } from '@/iam/enums/roles.enum';
import { Auth } from '@/iam/decorators/auth.decorator';
import { IamService } from '@/iam/iam.service';
import { setCookieOptions } from '@/iam/iam.constants';
import { UserDto } from '@/users/dto/user.dto'

@Auth(AuthType.None)
@ApiTags('auth')
@Controller('auth')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ description: 'Registered a new user and sent a confirmation email to the user.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async register(@Body() registerUserDto: RegisterUserDto): Promise<ChangePasswordResponse> {
    const userDto: UserDto = {
      ...registerUserDto,
      role: Role.Customer,
    };
    await this.iamService.register(userDto);

    return {
      message: 'User registrated successfully',
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({ description: 'Authentication a user with email and password credentials and return token.' })
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
  @ApiOperation({ summary: 'Logout a user' })
  @ApiOkResponse({ description: 'Logout Implementation' })
  public logout(@Res({ passthrough: true }) response: FastifyReply): { message: string } {
    // Clear HttpOnly cookie.
    response.clearCookie('refreshToken', setCookieOptions);

    return {
      message: 'Logout successful',
    };
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
  public async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    await this.iamService.forgotPassword(forgotPasswordDto);

    return {
      message: 'Password reset successfully',
    };
  }

  @ApiBearerAuth()
  @Auth(AuthType.Bearer)
  @Post('change-password')
  @ApiOperation({ summary: 'Request Change Password' })
  @ApiOkResponse({ description: 'Password has been changed and send a confirmation email to the user.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async changePassword(@Req() request: FastifyRequest, @Body() changePasswordDto: ChangePasswordDto): Promise<ChangePasswordResponse> {
    const userId: string = request.headers.id as string;
    await this.iamService.changePassword(+userId, changePasswordDto);

    return {
      message: 'Password changed successfully',
    };
  }
}
