import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import * as process from 'node:process'

// https://roxyapi.com/docs/astrology

@Injectable()
export class AstrologyService {
  constructor(private readonly httpService: HttpService) {}

  async myTry(): Promise<any> {
    const url = 'https://roxyapi.com/api/v1/data/astro/numerology/key-figures';
    const postData = {
      first_name: 'Jason',
      last_name: 'Doe',
      birthdate: '1979-08-01',
    };
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ROXYAPI_API_TOKEN,
    };

    try {
      return await lastValueFrom(
        this.httpService.post(url, postData, { headers }).pipe(
          // Extract the response data from the Axios response object.
          map(res => res.data),
        ),
      );
    } catch (error) {
      console.error('Error during POST request:', error);
      throw new Error('Failed to perform POST request');
    }
  }
}
