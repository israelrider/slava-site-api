import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AstrologyService } from '@/astrology/astrology.service';

@ApiBearerAuth()
@ApiTags('astrology')
@Controller('astrology')
export class AstrologyController {
  constructor(private readonly astrologyService: AstrologyService) {}

  @Get('my-try')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'My Try Endpoint' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  async myTry(): Promise<string> {
    return this.astrologyService.myTry();
  }
}
