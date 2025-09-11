import { Controller, Post, Body, HttpStatus, BadRequestException, HttpCode } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthType } from '@/iam/login/enums/auth-type.enum';
import { Auth } from '@/iam/login/decorators/auth.decorator';

import { RegisterService } from './register.service';
import { RegisterUserDto } from './dto/register-user.dto';

interface RegisterResponse {
  message: string;
  status: number;
}
@ApiTags('auth')
@Auth(AuthType.None)
@Controller('auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({
    description: 'Register a new user and send a confirmation email to the user',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async register(@Body() registerUserDto: RegisterUserDto): Promise<RegisterResponse> {
    try {
      await this.registerService.register(registerUserDto);

      return {
        message: 'User registration successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: User not registration!');
    }
  }
}
