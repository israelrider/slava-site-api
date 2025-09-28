import { NotFoundException } from '@nestjs/common';
import { Repository, InsertResult, UpdateResult } from 'typeorm';

import { User } from '@/users/models/user.model';
import { UserProfileDto } from '@/users/dto/user-profile.dto';
import { UserUpdateDto } from '@/users/dto/user-update.dto';
import { UserDto } from '@/users/dto/user.dto';
import { HashingService } from '@/common/hashing/hashing.service';
import { AccountUser } from '@/users/interfaces/account-user.interface';
import { UsersRepository } from '@/users/interfaces/users.repository.interface';
import { toAccountUser } from '@/iam/utils'

export class UsersTypeOrmRepository implements UsersRepository {
  constructor(
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll(): Promise<AccountUser[]> {
    const users: User[] = await this.usersRepository.find();
    return users.map((user: User) => toAccountUser(user));
  }

  public async findByEmail(email: string): Promise<AccountUser | null> {
    if (!email || email.length === 0) {
      throw new NotFoundException('Email Not Found');
    }

    const user: User = await this.usersRepository.findOneBy({
      email: email,
    });

    return toAccountUser(user);
  }

  public async byEmailWithPassword(email: string): Promise<AccountUser | null> {
    if (!email || email.length === 0) {
      throw new NotFoundException('Email Not Found');
    }

    const user: User = await this.usersRepository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    return toAccountUser(user);
  }

  public async findBySub(sub: number): Promise<AccountUser> {
    if (!sub) {
      throw new NotFoundException('Sub Not Found');
    }

    const user: User = await this.usersRepository.findOneByOrFail({
      id: sub,
    });

    return toAccountUser(user);
  }

  public async findById(userId: number): Promise<AccountUser | null> {
    if (!userId) {
      throw new NotFoundException('User ID Not Found');
    }

    const user: User = await this.usersRepository.findOneBy({
      id: +userId,
    });

    return toAccountUser(user);
  }

  public async create(userDto: UserDto): Promise<InsertResult> {
    return await this.usersRepository.insert(userDto);
  }

  public async updatePassword(email: string, password: string): Promise<UpdateResult> {
    const newPassword: string = await this.hashingService.hash(password);
    const updateResult: UpdateResult = await this.usersRepository.update(
      {
        email,
      },
      {
        password: newPassword,
      },
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return updateResult;
  }

  public async updateUserProfile(id: number, userProfileDto: UserProfileDto): Promise<UpdateResult> {
    const updateResult: UpdateResult = await this.usersRepository.update(
      {
        id,
      },
      {
        ...userProfileDto,
      },
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updateResult;
  }

  public async updateUser(id: number, userUpdateDto: UserUpdateDto): Promise<UpdateResult> {
    const updateResult: UpdateResult = await this.usersRepository.update(
      {
        id,
      },
      {
        ...userUpdateDto,
      },
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updateResult;
  }

  public async deleteUser(user: AccountUser): Promise<AccountUser> {
    const removedUser: User = await this.usersRepository.remove(user);
    return toAccountUser(removedUser);
  }
}
