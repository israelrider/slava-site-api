import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpdateResult } from 'typeorm';

import { AccountUser } from '@/users/interfaces/account-user.interface';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/models/user.model';
import { HashingService } from '@/common/hashing/hashing.service';
import { MailerService } from '@/common/mailer/mailer.service';
import { UtilsService } from '@/common/utils/utils.service';
import { changePasswordEmail, forgotPasswordEmail } from '@/common/mailer/mailer.constants';
import { AuthResponse } from '@/iam/interfaces/auth-response.interface';
import { JWTPayload } from '@/iam/interfaces/jwt-payload.interface';
import { jwtConfig } from '@/iam/config/jwt.config';
import { LoginDto } from '@/iam/dto/login.dto';
import { RefreshTokenDto } from '@/iam/dto/refresh-token.dto';
import { ChangePasswordDto } from '@/iam/dto/change-password.dto';
import { ForgotPasswordDto } from '@/iam/dto/forgot-password.dto';
import { ChangeRoleDto } from '@/iam/dto/change-role.dto'
import { Role } from '@/iam/enums/roles.enum';

@Injectable()
export class IamService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly mailerService: MailerService,
    private readonly utilsService: UtilsService,
  ) {}

  public async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const user: AccountUser = await this.usersService.byEmailWithPassword(loginDto.email);
      if (!user) {
        throw new UnauthorizedException('User does not exists');
      }

      const passwordIsValid: boolean = await this.hashingService.compare(loginDto.password, user.password);
      if (!passwordIsValid) {
        throw new UnauthorizedException('Authentication failed. Wrong password');
      }

      return await this.generateTokens(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async generateTokens(user: User): Promise<AuthResponse> {
    const role = this.utilsService.toEnum<Role>(Role, user.role);
    if (!role) {
      throw new UnauthorizedException('Invalid user role');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<JWTPayload>>(user.id, jwtConfig.accessTokenTtl ?? 3600, { role }),
      this.signToken(user.id, jwtConfig.refreshTokenTtl ?? 86400),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    };
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    const { id } = await this.jwtService.verifyAsync<Pick<JWTPayload, 'id'>>(refreshTokenDto.refreshToken);
    const user: AccountUser = await this.usersService.findBySub(id);

    return this.generateTokens(user);
  }

  public async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<UpdateResult> {
    const password: string = this.utilsService.generatePassword();
    const changePasswordDto: ChangePasswordDto = {
      email: forgotPasswordDto.email,
      password,
    };

    this.sendMailForgotPassword(changePasswordDto).catch(
      (err: unknown) => Logger.error('Forgot Password: Send Mail Failed', err),
    );

    return await this.usersService.updatePassword(changePasswordDto.email, changePasswordDto.password);
  }

  public async changePassword(changePasswordDto: ChangePasswordDto): Promise<UpdateResult> {
    this.sendMailChangePassword(changePasswordDto).catch(
      (err: unknown) => Logger.error('Change Password: Send Mail Failed!', err),
    );

    return await this.usersService.updatePassword(changePasswordDto.email, changePasswordDto.password);
  }

  public async changeRole(userId: number, changeRoleDto: ChangeRoleDto): Promise<UpdateResult> {
    const userUpdateDto = {
      role: changeRoleDto.role,
    };
    return await this.usersService.updateUser(userId, userUpdateDto);
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: userId,
        ...payload,
      },
      {
        expiresIn,
      },
    );
  }

  private async sendMailForgotPassword(user: ChangePasswordDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Forgot Password successful ✔',
        text: 'Forgot Password successful!',
        html: forgotPasswordEmail(user.password),
      });
      Logger.log('Forgot Password: Send Mail successfully!', 'MailService');
    } catch (err) {
      Logger.error('Forgot Password: Send Mail Failed!', err);
    }
  }

  private async sendMailChangePassword(user: ChangePasswordDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Change Password successful ✔',
        text: 'Change Password successful!',
        html: changePasswordEmail(user.password),
      });
      Logger.log('Change Password: Send Mail successfully!', 'MailService');
    } catch (err: unknown) {
      Logger.error('Change Password: Send Mail Failed!', err);
    }
  }
}
