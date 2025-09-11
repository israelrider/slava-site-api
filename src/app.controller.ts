import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

import { AppService } from '@/app.service';
import { Auth } from '@/iam/login/decorators/auth.decorator';
import { AuthType } from '@/iam/login/enums/auth-type.enum';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Auth(AuthType.None)
  @Get()
  @ApiOperation({ summary: 'Get public resource' })
  @ApiOkResponse({
    description: 'Example of a public resource',
  })
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  @Auth(AuthType.Bearer)
  @Get('secure')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get protected resource' })
  @ApiOkResponse({
    description: 'Example of a protected resource',
  })
  getProtectedResource(): { message: string } {
    return this.appService.getSecureResource();
  }
}
