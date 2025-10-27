import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { WeatherService } from '@/weather/weather.service';
import { GeolocationDto } from '@/weather/dto/geolocation.dto';

@ApiBearerAuth()
@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('table-data')
  @ApiOperation({ summary: 'Get weather table data' })
  @ApiResponse({ status: 200, description: 'Weather table data' })
  async tableData(@Query() query: GeolocationDto): Promise<any[]> {
    return this.weatherService.tableData(query);
  }

  @Get('chart-data')
  @ApiOperation({ summary: 'Get weather chart data' })
  @ApiResponse({ status: 200, description: 'Weather chart data' })
  async chartData(@Query() query: GeolocationDto): Promise<any> {
    return this.weatherService.chartData(query);
  }
}
