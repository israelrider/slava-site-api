import { Controller, Put, Get, Body, Param, Delete, Patch, Req } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { UpdateResult } from 'typeorm';

import { Role } from '@/iam/enums/roles.enum';
import { Roles } from '@/iam/decorators/roles.decorator';
import { UsersService } from '@/users/users.service';
import { UpdateProfileDto } from '@/users/dto/update-profile.dto';
import { UpdateRoleDto } from '@/users/dto/update-role.dto';
import { UpdateRatingDto } from '@/users/dto/update-rating.dto';
import { AccountUser } from '@/users/interfaces/account-user.interface';

@Roles(Role.Admin)
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'All users found' })
  public async findAllUsers(): Promise<AccountUser[]> {
    return await this.usersService.findAll();
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
  public async updateUserProfile(@Param('userId') userId: string, @Body() userProfileDto: UpdateProfileDto): Promise<UpdateResult> {
    return await this.usersService.updateProfile(+userId, userProfileDto);
  }

  @Roles(Role.Customer)
  @Patch('profile')
  @ApiOperation({ summary: 'Update own profile' })
  @ApiResponse({ status: 200, description: 'Own profile updated' })
  @ApiBadRequestResponse({ description: 'Own profile not updated' })
  public async updateOwnProfile(@Req() request: FastifyRequest, @Body() userProfileDto: UpdateProfileDto): Promise<UpdateResult> {
    const userId: string = request.headers.id as string;
    return await this.usersService.updateProfile(+userId, userProfileDto);
  }

  @Patch('/:userId/role')
  @ApiOperation({ summary: 'Request Change Role' })
  @ApiOkResponse({ description: 'User role changed successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async updateRole(@Param('userId') userId: string, @Body() updateRoleDto: UpdateRoleDto): Promise<UpdateResult> {
    return await this.usersService.updateRole(+userId, updateRoleDto);
  }

  @Roles(Role.Customer)
  @Patch('rating')
  @ApiOperation({ summary: 'Update site rating' })
  @ApiResponse({ status: 200, description: 'Site rating updated' })
  @ApiBadRequestResponse({ description: 'Site rating not updated' })
  public async updateRating(@Req() request: FastifyRequest, @Body() updateRatingDto: UpdateRatingDto): Promise<UpdateResult> {
    const userId: string = request.headers.id as string;
    return await this.usersService.updateRating(+userId, updateRatingDto);
  }

  @Delete('/:userId')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiNoContentResponse({ description: 'User not deleted' })
  public async deleteUser(@Param('userId') userId: string): Promise<AccountUser> {
    return await this.usersService.deleteUser(+userId);
  }
}
