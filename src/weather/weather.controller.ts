import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { Roles } from '@/iam/decorators/roles.decorator';
import { RolesGuard } from '@/iam/guards/roles.guard';
import { Role } from '@/iam/enums/roles.enum';
import { WeatherService } from '@/weather/weather.service';
import { GeolocationDto } from '@/weather/dto/geolocation.dto';
import { TableDataResponse } from '@/weather/interfaces/table-data-response.interface';
import { ChartDataResponse } from '@/weather/interfaces/chart-data-response.interface';

@UseGuards(RolesGuard)
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('table-data')
  @Roles(Role.Customer, Role.Admin)
  async tableData(@Query() query: GeolocationDto): Promise<TableDataResponse[]> {
    return this.weatherService.tableData(query);
  }

  @Get('chart-data')
  @Roles(Role.Customer, Role.Admin)
  async chartData(@Query() query: GeolocationDto): Promise<ChartDataResponse> {
    return this.weatherService.chartData(query);
  }
}
