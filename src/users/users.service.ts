import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';

import { UtilsService } from '@/common/utils/utils.service';
import { AccountUser } from '@/users/interfaces/account-user.interface';
import { USERS_REPOSITORY_TOKEN } from '@/users/interfaces/users.repository.interface';
import { UserProfileDto } from '@/users/dto/user-profile.dto';
import { UserUpdateDto } from '@/users/dto/user-update.dto';
import { UsersTypeOrmRepository } from '@/users/repositories/implementations/users.typeorm.repository';
import { User } from '@/users/models/user.model';
import { UserDto } from '@/users/dto/user.dto'

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

  public async byEmailWithPassword(email: string): Promise<AccountUser> {
    const user: User | null = await this.usersRepository.byEmailWithPassword(email);
    return this.utilsService.toAccountUser(user);
  }

  public async findBySub(sub: number): Promise<AccountUser> {
    const user: User = await this.usersRepository.findBySub(sub);
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

  public async updatePassword(email: string, password: string): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updatePassword(email, password);
    } catch (err) {
      Logger.error(`Failed to update password for email ${email}`, err, 'UsersService');
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUserProfile(id: number, userProfileDto: UserProfileDto): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updateUserProfile(id, userProfileDto);
    } catch (err) {
      Logger.error(`Failed to update profile for user ID ${id}`, err, 'UsersService');
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUser(id: number, userUpdateDto: UserUpdateDto): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updateUser(id, userUpdateDto);
    } catch (err) {
      Logger.error(`Failed to update user for ID ${id}`, err, 'UsersService');
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async createUser(userDto: UserDto): Promise<InsertResult> {
    return await this.usersRepository.create(userDto);
  }

  public async deleteUser(id: number): Promise<AccountUser> {
    const accountUser: AccountUser = await this.findById(id);
    const user: User = await this.usersRepository.deleteUser(accountUser);
    return this.utilsService.toAccountUser(user);
  }
}
