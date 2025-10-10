import { Module } from '@nestjs/common';

import { WeatherController } from '@/weather/weather.controller'
import { WeatherService } from '@/weather/weather.service';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
