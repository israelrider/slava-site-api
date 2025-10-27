import { Controller, Put, Get, Body, Param, Delete, Post, HttpCode } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RegisterUserDto } from '@/iam/dto/register-user.dto';
import { RegisterResponse } from '@/iam/interfaces/register-response.interface';
import { Role } from '@/iam/enums/roles.enum';
import { Roles } from '@/iam/decorators/roles.decorator';
import { UsersService } from '@/users/users.service';
import { UserProfileDto } from '@/users/dto/user-profile.dto';
import { UserUpdateDto } from '@/users/dto/user-update.dto';
import { UserDto } from '@/users/dto/user.dto';
import { AccountUser } from '@/users/interfaces/account-user.interface';
import { UpdateResponse } from '@/users/interfaces/update-response.interface';
import { AllUsersResponse } from '@/users/interfaces/all-users-response.interface';

@Roles(Role.Admin)
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'All users found' })
  public async findAllUsers(): Promise<AllUsersResponse> {
    const users: AccountUser[] = await this.usersService.findAll();
    return {
      users,
      roles: Object.values(Role),
    };
  }

  @Get('/:userId/profile')
  @ApiOperation({ summary: 'Find a user profile by id' })
  @ApiResponse({ status: 200, description: 'User profile found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  public async getUser(@Param('userId') userId: string): Promise<AccountUser> {
    return await this.usersService.findById(+userId);
  }

  @Put('/:userId/profile')
  @ApiOperation({ summary: 'Update a user profile by id' })
  @ApiResponse({ status: 200, description: 'User profile updated' })
  @ApiBadRequestResponse({ description: 'User profile not updated' })
  public async updateUserProfile(@Param('userId') userId: string, @Body() userProfileDto: UserProfileDto): Promise<UpdateResponse> {
    await this.usersService.updateUserProfile(+userId, userProfileDto);
    return {
      message: 'User Updated successfully!',
    };
  }

  @Put('/:userId')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiBadRequestResponse({ description: 'User not updated' })
  public async updateUser(@Param('userId') userId: string, @Body() userUpdateDto: UserUpdateDto): Promise<UpdateResponse> {
    await this.usersService.updateUser(+userId, userUpdateDto);
    return {
      message: 'User Updated successfully!',
    };
  }

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ description: 'Registered a new user and sent a confirmation email to the user.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async register(@Body() registerUserDto: RegisterUserDto): Promise<RegisterResponse> {
    const userDto: UserDto = {
      ...registerUserDto,
      role: Role.Customer,
    };
    await this.usersService.register(userDto);

    return {
      message: 'User registration successfully!',
    };
  }

  @Delete('/:userId')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiNoContentResponse({ description: 'User not deleted' })
  public async deleteUser(@Param('userId') userId: string): Promise<AccountUser> {
    return await this.usersService.deleteUser(+userId);
  }
}
