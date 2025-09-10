import { Controller, Post, Body, HttpStatus, BadRequestException, HttpCode } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@/iam/login/decorators/auth-guard.decorator';
import { AuthType } from '@/iam/login/enums/auth-type.enum';

import { ChangePasswordService } from './change-password.service';
import { ChangePasswordDto } from './dto/change-password.dto';

interface ChangePasswordResponse {
  message: string;
  status: number;
}

@ApiTags('auth')
@ApiBearerAuth()
@AuthGuard(AuthType.Bearer)
@Controller('auth/change-password')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Request Change Password' })
  @ApiOkResponse({
    description: 'Request Change Password and send a confirmation email to the user',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<ChangePasswordResponse> {
    try {
      await this.changePasswordService.changePassword(changePasswordDto);

      return {
        message: 'Request Change Password Successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: Change password failed!');
    }
  }
}
