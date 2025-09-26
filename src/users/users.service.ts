import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';

import { AccountUser } from './interfaces/account-user.interface';
import { USERS_REPOSITORY_TOKEN } from './interfaces/users.repository.interface';
import { UserDto } from './dto/user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UsersTypeOrmRepository } from './repositories/implementations/users.typeorm.repository';
import { registrationEmail } from '@/common/mailer/mailer.constants'
import { HashingService } from '@/common/hashing/hashing.service'
import { MailerService } from '@/common/mailer/mailer.service'

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersTypeOrmRepository,
    private readonly hashingService: HashingService,
    private readonly mailerService: MailerService,
  ) {}

  public async findAll(): Promise<AccountUser[]> {
    return await this.usersRepository.findAll();
  }

  public async byEmailWithPassword(email: string): Promise<AccountUser> {
    return await this.usersRepository.byEmailWithPassword(email);
  }

  public async findBySub(sub: number): Promise<AccountUser> {
    return await this.usersRepository.findBySub(sub);
  }

  public async findById(userId: number): Promise<AccountUser> {
    const user: AccountUser | null = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return user;
  }

  public async updatePassword(email: string, password: string): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updatePassword(email, password);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUserProfile(id: number, userProfileDto: UserProfileDto): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updateUserProfile(id, userProfileDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUser(id: number, userUpdateDto: UserUpdateDto): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updateUser(id, userUpdateDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async register(userDto: UserDto): Promise<InsertResult> {
    userDto.password = await this.hashingService.hash(userDto.password);

    this.sendMailRegisterUser(userDto)
      .catch((err: unknown) => Logger.error('Send mail failed but continuing registration', err));

    try {
      return await this.usersRepository.create(userDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteUser(id: number): Promise<AccountUser> {
    const user: AccountUser = await this.findById(id);
    return await this.usersRepository.deleteUser(user);
  }

  private async sendMailRegisterUser(user: UserDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Registration successful ✔',
        html: registrationEmail(user),
      });

      Logger.log('User Registration: Send Mail successfully!', 'MailService');
    } catch (err: unknown) {
      Logger.error('User Registration: Send Mail failed!', err);
    }
  }
}
