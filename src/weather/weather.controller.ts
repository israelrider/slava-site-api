import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { Roles } from '@/iam/decorators/roles.decorator';
import { RolesGuard } from '@/iam/guards/roles/roles.guard';
import { Role } from '@/iam/enums/roles.enum';
import { WeatherService } from '@/weather/weather.service';
import { GeolocationDto } from '@/weather/dto/geolocation.dto'

@UseGuards(RolesGuard)
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('table-data')
  @Roles(Role.Customer)
  async tableData(@Query() query: GeolocationDto): Promise<any[]> {
    return this.weatherService.tableData(query);
  }

  @Get('chart-data')
  @Roles(Role.Customer)
  async chartData(@Query() query: GeolocationDto): Promise<any> {
    return this.weatherService.chartData(query);
  }
}
