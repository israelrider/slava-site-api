import { Controller, Put, Get, Body, Param, HttpStatus, NotFoundException, Delete, BadRequestException, Post, HttpCode, Logger } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from '@/iam/decorators/auth.decorator';
import { AuthType } from '@/iam/enums/auth-type.enum';
import { RegisterUserDto } from '@/iam/dto/register-user.dto';
import { RegisterResponse } from '@/iam/interfaces/register-response.interface';
import { Role } from '@/iam/enums/roles.enum';

import { UsersService } from '@/users/users.service';
import { UserProfileDto } from '@/users/dto/user-profile.dto';
import { UserUpdateDto } from '@/users/dto/user-update.dto';
import { UserDto } from '@/users/dto/user.dto';
import { AccountUser } from '@/users/interfaces/account-user.interface';
import { GetUserResponse } from '@/users/interfaces/get-user-response.interface';
import { UpdateResponse } from '@/users/interfaces/update-response.interface';
import { AllUsersResponse } from '@/users/interfaces/all-users-response.interface';

@ApiTags('users')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'Get all users' })
  public async findAllUsers(): Promise<AllUsersResponse> {
    const users: AccountUser[] = await this.usersService.findAll();
    return {
      users,
      roles: Object.values(Role),
      status: HttpStatus.OK,
    };
  }

  @Get('/:userId/profile')
  @ApiOperation({ summary: 'Find a user profile by id' })
  @ApiResponse({ status: 200, description: 'Get a user profile by id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  public async getUser(@Param('userId') userId: string): Promise<GetUserResponse> {
    const user: AccountUser = await this.usersService.findById(+userId);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return {
      user,
      status: HttpStatus.OK,
    };
  }

  @Put('/:userId/profile')
  @ApiOperation({ summary: 'Update a user profile by id' })
  @ApiResponse({ status: 200, description: 'Update a user profile by id' })
  @ApiBadRequestResponse({ description: 'User profile not updated' })
  public async updateUserProfile(@Param('userId') userId: string, @Body() userProfileDto: UserProfileDto): Promise<UpdateResponse> {
    try {
      await this.usersService.updateUserProfile(+userId, userProfileDto);

      return {
        message: 'User Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: User not updated!');
    }
  }

  @Put('/:userId')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiResponse({ status: 200, description: 'Update a user by id' })
  @ApiBadRequestResponse({ description: 'User not updated' })
  public async updateUser(@Param('userId') userId: string, @Body() userUpdateDto: UserUpdateDto): Promise<UpdateResponse> {
    try {
      await this.usersService.updateUser(+userId, userUpdateDto);

      return {
        message: 'User Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: User not updated!');
    }
  }

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({
    description: 'Register a new user and send a confirmation email to the user',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async register(@Body() registerUserDto: RegisterUserDto): Promise<RegisterResponse> {
    try {
      const userDto: UserDto = {
        ...registerUserDto,
        role: Role.Customer,
      };
      await this.usersService.register(userDto);

      return {
        message: 'User registration successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (err) {
      Logger.error('User registration failed!', err);
      throw new BadRequestException('Registration failed.');
    }
  }

  @Delete('/:userId')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({ status: 200, description: 'Delete a user by id' })
  @ApiNoContentResponse({ description: 'User not deleted' })
  public async deleteUser(@Param('userId') userId: string): Promise<AccountUser> {
    return await this.usersService.deleteUser(+userId);
  }
}
