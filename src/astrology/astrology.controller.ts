import { Controller, Get, UseGuards } from '@nestjs/common';

import { Roles } from '@/iam/decorators/roles.decorator';
import { RolesGuard } from '@/iam/guards/roles/roles.guard';
import { Role } from '@/iam/enums/roles.enum';
import { AstrologyService } from '@/astrology/astrology.service';
import { ApiBearerAuth } from '@nestjs/swagger'
import { Auth } from '@/iam/decorators/auth.decorator'
import { AuthType } from '@/iam/enums/auth-type.enum'

//@UseGuards(RolesGuard)
@Controller('astrology')
export class AstrologyController {
  constructor(private readonly astrologyService: AstrologyService) {}

  @Get('my-try')
  @ApiBearerAuth()
  @Auth(AuthType.Bearer)
  @Roles(Role.Customer)
  async myTry(): Promise<string> {
    return this.astrologyService.myTry();
  }
}
