import { IsNotEmpty } from 'class-validator';
import { ExamError } from '../enums';

export class AnswerExcerciseDto {
  @IsNotEmpty({ message: ExamError.EXCERCISE, always: true })
  excercise: string;

  @IsNotEmpty({ message: ExamError.CORRECT, always: true })
  correct: boolean;
}
