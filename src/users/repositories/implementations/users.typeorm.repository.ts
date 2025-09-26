import { NotFoundException } from '@nestjs/common';
import { Repository, InsertResult, UpdateResult } from 'typeorm';

import { User } from '@/users/models/user.model';
import { UserProfileDto } from '@/users/dto/user-profile.dto';
import { UserUpdateDto } from '@/users/dto/user-update.dto';
import { UserDto } from '@/users/dto/user.dto';
import { HashingService } from '@/common/hashing/hashing.service';
import { AccountUser } from '@/users/interfaces/account-user.interface';
import { UsersRepository } from '@/users/interfaces/users.repository.interface';

export class UsersTypeOrmRepository implements UsersRepository {
  constructor(
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll(): Promise<AccountUser[]> {
    return await this.usersRepository.find();
  }

  public async findByEmail(email: string): Promise<AccountUser | null> {
    if (!email || email.length === 0) {
      throw new NotFoundException('Email Not Found');
    }

    return await this.usersRepository.findOneBy({
      email: email,
    });
  }

  public async byEmailWithPassword(email: string): Promise<AccountUser | null> {
    if (!email || email.length === 0) {
      throw new NotFoundException('Email Not Found');
    }

    return await this.usersRepository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  public async findBySub(sub: number): Promise<AccountUser> {
    if (!sub) {
      throw new NotFoundException('Sub Not Found');
    }

    return await this.usersRepository.findOneByOrFail({
      id: sub,
    });
  }

  public async findById(userId: number): Promise<AccountUser | null> {
    if (!userId) {
      throw new NotFoundException('User ID Not Found');
    }

    return await this.usersRepository.findOneBy({
      id: +userId,
    });
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
    return await this.usersRepository.remove(user);
  }
}
