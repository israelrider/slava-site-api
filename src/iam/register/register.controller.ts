import { Controller, Post, Body, HttpStatus, BadRequestException, HttpCode } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthType } from '@/iam/login/enums/auth-type.enum';
import { Auth } from '@/iam/login/decorators/auth.decorator';
import { Role } from '@/iam/login/enums/roles.enum';
import { UserDto } from '@/users/dto/user.dto';

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
      const userDto = {
        ...registerUserDto,
        role: Role.reader,
      };
      await this.registerService.register(userDto);

      return {
        message: 'User registration successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Registration failed.');
    }
  }
}
