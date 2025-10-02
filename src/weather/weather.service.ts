import { Injectable } from '@nestjs/common';
import { fetchWeatherApi } from 'openmeteo';
import { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';
import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response'

import { GeolocationDto } from '@/weather/dto/geolocation.dto'

@Injectable()
export class WeatherService {
  async tableData(geolocation: GeolocationDto): Promise<any[]> {
    // console.log(geolocation);
    const params = {
      latitude: [geolocation.latitude],
      longitude: [geolocation.longitude],
      timezone: geolocation.timezone,
      // Note: The order of weather variables in the URL query and the indices below need to match.
      daily: [
        'weather_code',
        'temperature_2m_min',
        'temperature_2m_max',
        'wind_speed_10m_max',
        'wind_direction_10m_dominant',
      ],
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses: WeatherApiResponse[] = await fetchWeatherApi(url, params);
    // Process first location.
    // Add a for-loop for multiple locations or weather models.
    const response = responses[0];

    // Attributes for timezone and location.
    const utcOffsetSeconds: number = response.utcOffsetSeconds();

    const daily: VariablesWithTime = response.daily();

    // Note: The order of weather variables in the URL query and the indices below need to match.
    const weatherData = {
      daily: {
        time: this.prepareTime(daily, utcOffsetSeconds),
        weatherCode: daily.variables(0).valuesArray(),
        temperatureMin: daily.variables(1).valuesArray(),
        temperatureMax: daily.variables(2).valuesArray(),
        windSpeedMax: daily.variables(3).valuesArray(),
        windDirectionDominant: daily.variables(4).valuesArray(),
      },
    };

    const result: any[] = [];
    for (let i = 0; i < weatherData.daily.time.length; i++) {
      result.push({
        time: weatherData.daily.time[i].toISOString(),
        weatherCode: weatherData.daily.weatherCode[i],
        temperatureMin: Math.round(weatherData.daily.temperatureMin[i]),
        temperatureMax: Math.round(weatherData.daily.temperatureMax[i]),
        windSpeedMax: parseFloat(weatherData.daily.windSpeedMax[i].toFixed(1)),
        windDirectionDominant: weatherData.daily.windDirectionDominant[i],
      });
    }

    return result;
  }

  async chartData(geolocation: GeolocationDto): Promise<any> {
    // console.log(geolocation);
    const params = {
      latitude: [geolocation.latitude],
      longitude: [geolocation.longitude],
      timezone: geolocation.timezone,
      // Note: The order of weather variables in the URL query and the indices below need to match.
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'pressure_msl',
      ],
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses: WeatherApiResponse[] = await fetchWeatherApi(url, params);
    // Process first location.
    // Add a for-loop for multiple locations or weather models.
    const response = responses[0];

    // Timezone difference to GMT+0 (s)`,
    const utcOffsetSeconds: number = response.utcOffsetSeconds();

    const hourly: VariablesWithTime = response.hourly();

    // Note: The order of weather variables in the URL query and the indices below need to match.
    const weatherData = {
      hourly: {
        time: this.preparePointsStep(
          this.prepareTime(hourly, utcOffsetSeconds),
        ),
        temperature: this.preparePointsStep(
          Object.values(
            hourly.variables(0).valuesArray(),
          ),
        ).map(value => Math.round(value)), // `.valuesArray()` get an array of floats
        relativeHumidity: this.preparePointsStep(
          Object.values(
            hourly.variables(1).valuesArray(),
          ),
        ),
        pressure: this.preparePointsStep(
          Object.values(
            hourly.variables(2).valuesArray(),
          ),
        ).map(value => Math.round(value)),
      },
    };

    return weatherData.hourly;
  }

  private preparePointsStep(data: any[]): any[] {
    return data.filter((value, index) => Number.isInteger(index / 3))
  }

  // Helper function to form time ranges.
  private range(start: number, stop: number, step: number) {
    return Array.from(
      {
        length: (stop - start) / step,
      },
      (_, i) => start + i * step,
    );
  }

  private prepareTime(receivedTime: VariablesWithTime, utcOffsetSeconds: number): Date[] {
    const time: number[] = this.range(Number(receivedTime.time()), Number(receivedTime.timeEnd()), receivedTime.interval());
    return time.map(
      (t: number) => new Date((t + utcOffsetSeconds) * 1000),
    );
  }
}
