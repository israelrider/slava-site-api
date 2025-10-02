import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GeolocationDto {
  @IsNumber()
  readonly latitude: number;

  @IsNumber()
  readonly longitude: number;

  @IsString()
  @IsNotEmpty()
  readonly timezone: string;
}
