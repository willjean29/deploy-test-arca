import { IsNotEmpty } from 'class-validator';
import { ExamError } from '../enums';

export class StartExamDto {
  @IsNotEmpty({ message: ExamError.START_DATE, always: true })
  startDate: string;

  @IsNotEmpty({ message: ExamError.FINISH_DATE, always: true })
  finishDate: string;
}
