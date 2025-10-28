import { Controller, Put, Get, Body, Param, Delete, Patch, Req } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { UpdateResult } from 'typeorm';

import { Role } from '@/iam/enums/roles.enum';
import { Roles } from '@/iam/decorators/roles.decorator';
import { UsersService } from '@/users/users.service';
import { UserProfileDto } from '@/users/dto/user-profile.dto';
import { UserUpdateDto } from '@/users/dto/user-update.dto';
import { ChangeRoleDto } from '@/users/dto/change-role.dto';
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

  @Roles(Role.Customer)
  @Patch()
  @ApiOperation({ summary: 'Update own profile' })
  @ApiResponse({ status: 200, description: 'Own profile updated' })
  @ApiBadRequestResponse({ description: 'Own profile not updated' })
  public async updateOwnProfile(@Req() request: FastifyRequest, @Body() userUpdateDto: UserUpdateDto): Promise<UpdateResult> {
    const userId: string = request.headers.id as string;
    return await this.usersService.updateUser(+userId, userUpdateDto);
  }

  @Patch('/:userId/role')
  @ApiOperation({ summary: 'Request Change Role' })
  @ApiOkResponse({ description: 'User role changed successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async changeRole(@Param('userId') userId: string, @Body() changeRoleDto: ChangeRoleDto): Promise<UpdateResponse> {
    const userUpdateDto: UserUpdateDto = {
      role: changeRoleDto.role,
    };
    await this.usersService.updateUser(+userId, userUpdateDto);

    return {
      message: 'Request Change Role Successfully!',
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
