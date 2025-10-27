import { Module } from '@nestjs/common';

import { WeatherController } from '@/weather/weather.controller'
import { WeatherService } from '@/weather/weather.service';
import { UtilsModule } from '@/common/utils/utils.module'

@Module({
  imports: [UtilsModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
