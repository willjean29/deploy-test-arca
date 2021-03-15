import { IsNotEmpty, IsOptional } from 'class-validator';
import { HomeworkError } from '../enums';

export class HomeworkClassroomDto {
  @IsNotEmpty({ message: HomeworkError.NAME, always: true })
  name: string;

  @IsNotEmpty({ message: HomeworkError.HOMEWORK, always: true })
  homework: string;

  @IsOptional()
  @IsNotEmpty({ message: HomeworkError.DURATION, always: true })
  duration?: string;

  @IsNotEmpty({ message: HomeworkError.CLASSROOM_ID, always: true })
  classroom: string;

  @IsNotEmpty({ message: HomeworkError.START_DATE, always: true })
  startDate: string;

  @IsNotEmpty({ message: HomeworkError.ACTIVE, always: true })
  active: boolean;
}
