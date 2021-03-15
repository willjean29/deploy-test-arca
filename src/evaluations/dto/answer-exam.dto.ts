import { IsNotEmpty } from 'class-validator';
import { ExamError } from '../enums';
import { AnswerExcercise } from '../models/answer-excercise.interface';

export class AnswerExamDto {
  @IsNotEmpty({ message: ExamError.STUDENTS, always: true })
  student: string;

  @IsNotEmpty({ message: ExamError.EXAM_CLASSROOM, always: true })
  examClassroom: string;

  @IsNotEmpty({ message: ExamError.ANSWERS, always: true })
  answers: AnswerExcercise[];

  @IsNotEmpty({ message: ExamError.CORRECT, always: true })
  correct: number;

  @IsNotEmpty({ message: ExamError.INCORRECT, always: true })
  incorrect: number;
}
