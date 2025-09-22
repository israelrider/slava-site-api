import { NotFoundException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';

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
    return await this.usersRepository.findOneBy({
      email: email,
    });
  }

  public async byEmailWithPassword(email: string): Promise<AccountUser | null> {
    return await this.usersRepository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  public async findBySub(sub: number): Promise<AccountUser> {
    if (!sub && sub !== 0) {
      throw new NotFoundException('Sub Not Found');
    }

    return await this.usersRepository.findOneByOrFail({
      id: sub,
    });
  }

  public async findById(userId: string): Promise<AccountUser | null> {
    return await this.usersRepository.findOneBy({
      id: +userId,
    });
  }

  public async create(userDto: UserDto): Promise<AccountUser> {
    return await this.usersRepository.save(userDto);
  }

  public async updateByEmail(email: string): Promise<AccountUser> {
    const user = await this.usersRepository.findOneBy({ email: email });

    user.password = await this.hashingService.hash(
      Math.random().toString(36).slice(-8),
    );

    return await this.usersRepository.save(user);
  }

  public async updateByPassword(email: string, password: string): Promise<AccountUser> {
    const user = await this.usersRepository.findOneBy({ email: email });
    user.password = await this.hashingService.hash(password);

    return await this.usersRepository.save(user);
  }

  public async updateUserProfile(id: string, userProfileDto: UserProfileDto): Promise<AccountUser> {
    const user = await this.usersRepository.findOneBy({ id: +id });
    user.name = userProfileDto.name;
    user.email = userProfileDto.email;
    user.role = userProfileDto.role;

    return await this.usersRepository.save(user);
  }

  public async updateUser(id: string, userUpdateDto: UserUpdateDto): Promise<UpdateResult> {
    return await this.usersRepository.update(
      {
        id: +id,
      },
      { ...userUpdateDto },
    );
  }

  public async deleteUser(user: AccountUser): Promise<AccountUser> {
    return await this.usersRepository.remove(user);
  }
}
