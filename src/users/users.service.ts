import { Injectable, NotFoundException, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { AccountUser } from './interfaces/account-user.interface';
import { USERS_REPOSITORY_TOKEN } from './interfaces/users.repository.interface';
import { UserDto } from './dto/user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UsersTypeOrmRepository } from './repositories/implementations/users.typeorm.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersTypeOrmRepository,
  ) {}

  public async findAll(): Promise<AccountUser[]> {
    return await this.usersRepository.findAll();
  }

  public async findByEmail(email: string): Promise<AccountUser> {
    const user: AccountUser | null = await this.usersRepository.byEmailWithPassword(email);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  public async findBySub(sub: number): Promise<AccountUser> {
    return await this.usersRepository.findBySub(sub);
  }

  public async findById(userId: string): Promise<AccountUser> {
    const user: AccountUser | null = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return user;
  }

  public async create(userDto: UserDto): Promise<AccountUser> {
    try {
      return await this.usersRepository.create(userDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByEmail(email: string): Promise<AccountUser> {
    try {
      return await this.usersRepository.updateByEmail(email);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByPassword(email: string, password: string): Promise<AccountUser> {
    try {
      return await this.usersRepository.updateByPassword(email, password);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUserProfile(id: string, userProfileDto: UserProfileDto): Promise<AccountUser> {
    try {
      return await this.usersRepository.updateUserProfile(id, userProfileDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUser(id: string, userUpdateDto: UserUpdateDto): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updateUser(id, userUpdateDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteUser(id: string): Promise<AccountUser> {
    const user: AccountUser = await this.findById(id);
    return await this.usersRepository.deleteUser(user);
  }
}
