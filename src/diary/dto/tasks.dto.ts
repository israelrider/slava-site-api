import { TaskDetailsDto } from './task-details.dto';

export class TasksDto {
  readonly [key: string]: TaskDetailsDto;
}
