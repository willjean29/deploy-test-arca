import { IsNotEmpty } from 'class-validator';
import { ExamError } from '../enums';

export class HomeworkDto {
  @IsNotEmpty({ message: ExamError.NAME, always: true })
  name: string;

  @IsNotEmpty({ message: ExamError.COURSE, always: true })
  course: string;

  @IsNotEmpty({ message: ExamError.GRADE, always: true })
  grade: string;

  @IsNotEmpty({ message: ExamError.LEVEL, always: true })
  level: string;

  @IsNotEmpty({ message: ExamError.TEACHER, always: true })
  teacher: string;

  @IsNotEmpty({ message: ExamError.EXCERCISES, always: true })
  excercises: string[];
}
