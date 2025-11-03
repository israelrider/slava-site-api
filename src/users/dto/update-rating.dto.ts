import { Min, Max, IsInt } from 'class-validator';

export class UpdateRatingDto {
  @IsInt()
  @Min(0)
  @Max(5)
  readonly rating: number;
}
