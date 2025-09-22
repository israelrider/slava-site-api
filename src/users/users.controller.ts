import { Controller, Put, Get, Body, Param, HttpStatus, NotFoundException, Delete, BadRequestException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from '@/iam/login/decorators/auth.decorator';
import { AuthType } from '@/iam/login/enums/auth-type.enum';

import { UsersService } from './users.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { AccountUser } from './interfaces/account-user.interface';
import { GetUserResponse } from './interfaces/get-user-response.interface';
import { UpdateResponse } from './interfaces/update-response.interface';

@ApiTags('users')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'Get all users' })
  public async findAllUsers(): Promise<AccountUser[]> {
    return this.usersService.findAll();
  }

  @Get('/:userId')
  @ApiOperation({ summary: 'Find a user by id' })
  @ApiResponse({ status: 200, description: 'Get a user by id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  public async findOneUser(@Param('userId') userId: string): Promise<AccountUser> {
    return this.usersService.findById(userId);
  }

  @Get('/:userId/profile')
  @ApiOperation({ summary: 'Find a user profile by id' })
  @ApiResponse({ status: 200, description: 'Get a user profile by id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  public async getUser(@Param('userId') userId: string): Promise<GetUserResponse> {
    const user: AccountUser = await this.findOneUser(userId);

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
      await this.usersService.updateUserProfile(userId, userProfileDto);

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
      await this.usersService.updateUser(userId, userUpdateDto);

      return {
        message: 'User Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: User not updated!');
    }
  }

  @Delete('/:userId')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({ status: 200, description: 'Delete a user by id' })
  @ApiNoContentResponse({ description: 'User not deleted' })
  public async deleteUser(@Param('userId') userId: string): Promise<AccountUser> {
    return await this.usersService.deleteUser(userId);
  }
}
