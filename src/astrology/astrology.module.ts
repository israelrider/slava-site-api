import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'

import { AstrologyController } from '@/astrology/astrology.controller'
import { AstrologyService } from '@/astrology/astrology.service';

@Module({
  imports: [HttpModule],
  controllers: [AstrologyController],
  providers: [AstrologyService],
})
export class AstrologyModule {}
