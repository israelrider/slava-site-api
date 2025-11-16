import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Repository, InsertResult, UpdateResult } from 'typeorm';

import { User } from '@/users/models/user.model';
import { RegisterUserDto } from '@/iam/dto/register-user.dto';
import { HashingService } from '@/common/hashing/hashing.service';
import { AccountUser } from '@/users/interfaces/account-user.interface';
import { UsersRepository } from '@/users/interfaces/users.repository.interface';

export class UsersTypeOrmRepository implements UsersRepository {
  constructor(
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  public async byEmailWithPassword(email: string): Promise<User | null> {
    return await this.usersRepository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  public async findById(userId: number): Promise<User | null> {
    if (!userId) {
      throw new NotFoundException('User ID Not Found');
    }

    return await this.usersRepository.findOneBy({
      id: +userId,
    });
  }

  public async create(registerUserDto: RegisterUserDto): Promise<InsertResult> {
    return await this.usersRepository.insert(registerUserDto);
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
      Logger.warn(`Password update failed for user with email ${email}`, 'UsersTypeOrmRepository');
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return updateResult;
  }

  public async updateUser<T>(id: number, updateData: T): Promise<UpdateResult> {
    const updateResult: UpdateResult = await this.usersRepository.update(id, updateData);

    if (updateResult.affected === 0) {
      Logger.warn(`User update failed for user ID ${id}`, 'UsersTypeOrmRepository');
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updateResult;
  }

  public async deleteUser(user: AccountUser): Promise<User> {
    if (user.id === +process.env.SUPER_ADMIN_ID) {
      Logger.warn('Attempt to delete super admin user', 'UsersTypeOrmRepository');
      throw new BadRequestException('Cannot delete super admin user');
    }

    return await this.usersRepository.remove(user as User);
  }
}
