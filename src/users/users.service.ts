import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';

import { UtilsService } from '@/common/utils/utils.service';
import { AccountUser } from '@/users/interfaces/account-user.interface';
import { USERS_REPOSITORY_TOKEN } from '@/users/interfaces/users.repository.interface';
import { UpdateProfileDto } from '@/users/dto/update-profile.dto';
import { RegisterUserDto } from '@/iam/dto/register-user.dto';
import { UpdateRatingDto } from '@/users/dto/update-rating.dto';
import { UsersTypeOrmRepository } from '@/users/repositories/implementations/users.typeorm.repository';
import { User } from '@/users/models/user.model';
import { UpdateRoleDto } from '@/users/dto/update-role.dto'

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersTypeOrmRepository,
    private readonly utilsService: UtilsService,
  ) {}

  public async findAll(): Promise<AccountUser[]> {
    const users: User[] = await this.usersRepository.findAll();
    return users.map((user: User) => this.utilsService.toAccountUser(user));
  }

  public async byEmailWithPassword(email: string): Promise<AccountUser | null> {
    const user: User | null = await this.usersRepository.byEmailWithPassword(email);
    return this.utilsService.toAccountUser(user);
  }

  public async findById(userId: number): Promise<AccountUser> {
    const user: User | null = await this.usersRepository.findById(userId);

    if (!user) {
      Logger.warn(`User not found for ID ${userId}`, 'UsersService');
      throw new NotFoundException(`User not found`);
    }

    return this.utilsService.toAccountUser(user);
  }

  // The proxy method, that is called from IamService only.
  public async updatePassword(email: string, password: string): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updatePassword(email, password);
    } catch (err) {
      Logger.error(`Failed to update password for email ${email}`, err, 'UsersService');
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateProfile(id: number, userProfileDto: UpdateProfileDto): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updateUser<UpdateProfileDto>(id, userProfileDto);
    } catch (err) {
      Logger.error(`Failed to update profile for user ID ${id}`, err, 'UsersService');
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updateUser<UpdateRoleDto>(id, updateRoleDto);
    } catch (err) {
      Logger.error(`Failed to update role for user ID ${id}`, err, 'UsersService');
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateRating(id: number, updateRatingDto: UpdateRatingDto): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updateUser<UpdateRatingDto>(id, updateRatingDto);
    } catch (err) {
      Logger.error(`Failed to update rating for user ID ${id}`, err, 'UsersService');
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async markEmailAsConfirmed(id: number): Promise<UpdateResult> {
    return this.usersRepository.updateUser(id, { isEmailConfirmed: true });
  }

  public async createUser(registerUserDto: RegisterUserDto, user: AccountUser): Promise<void> {
    if (user) {
      await this.usersRepository.updateUser<UpdateProfileDto>(user.id, registerUserDto);
      return;
    }

    await this.usersRepository.create(registerUserDto);
  }

  public async deleteUser(id: number): Promise<AccountUser> {
    const accountUser: AccountUser = await this.findById(id);
    const user: User = await this.usersRepository.deleteUser(accountUser);
    return this.utilsService.toAccountUser(user);
  }
}
