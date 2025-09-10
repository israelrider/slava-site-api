import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Users } from '@/users/models/users.model';
import { UsersRepository } from '@/users/repositories/users.repository.interface';
import { UserProfileDto } from '@/users/dto/user-profile.dto';
import { UserUpdateDto } from '@/users/dto/user-update.dto';
import { UserDto } from '@/users/dto/user.dto';
import { HashingService } from '@/common/hashing/hashing.service';
// import { AccountsUsers } from '@/users/interfaces/accounts-users.interface';

export class UsersTypeOrmRepository implements UsersRepository {
  constructor(
    private readonly usersRepository: Repository<Users>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll() {
    return await this.usersRepository.find();
  }

  public async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({
      email: email,
    });
  }

  public async findBySub(sub: number) {
    if (!sub && sub !== 0) {
      throw new NotFoundException('Sub Not Found');
    }

    return await this.usersRepository.findOneByOrFail({
      id: sub,
    });
  }

  public async findById(userId: string) {
    return await this.usersRepository.findOneBy({
      id: +userId,
    });
  }

  public async create(userDto: UserDto) {
    return await this.usersRepository.save(userDto);
  }

  public async updateByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email: email });
    // prettier-ignore
    user.password = await this.hashingService.hash(
      Math.random().toString(36).slice(-8),
    );

    return await this.usersRepository.save(user);
  }

  public async updateByPassword(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({ email: email });
    user.password = await this.hashingService.hash(password);

    return await this.usersRepository.save(user);
  }

  public async updateUserProfile(id: string, userProfileDto: UserProfileDto) {
    const user = await this.usersRepository.findOneBy({ id: +id });
    user.name = userProfileDto.name;
    user.email = userProfileDto.email;
    user.username = userProfileDto.username;

    return await this.usersRepository.save(user);
  }

  public async updateUser(id: string, userUpdateDto: UserUpdateDto) {
    return await this.usersRepository.update(
      {
        id: +id,
      },
      { ...userUpdateDto },
    );
  }

  public async deleteUser(user: any) {
    await this.usersRepository.remove(user);
  }
}
