import { IsNumber } from 'class-validator';

export class GeolocationDto {
  @IsNumber()
  readonly latitude: number;

  @IsNumber()
  readonly longitude: number;
}
