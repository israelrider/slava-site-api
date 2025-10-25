import { MaxLength, IsNotEmpty, IsString, IsInt, Max, Min } from 'class-validator';

export class TaskDetailsDto {
  @IsInt()
  @Min(0)
  @Max(3000)
  readonly coordinate: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  readonly name: string;
}
