import { IsNotEmpty, IsOptional } from 'class-validator';
import { ExamError } from '../enums';

export class ExamClassroomDto {
  @IsNotEmpty({ message: ExamError.NAME, always: true })
  name: string;

  @IsNotEmpty({ message: ExamError.EXAM, always: true })
  exam: string;

  @IsNotEmpty({ message: ExamError.CLASSROOM_ID, always: true })
  classroom: string;

  @IsOptional()
  @IsNotEmpty({ message: ExamError.START_DATE, always: true })
  startDate: string;

  @IsOptional()
  @IsNotEmpty({ message: ExamError.FINISH_DATE, always: true })
  finishDate: string;

  @IsNotEmpty({ message: ExamError.ACTIVE, always: true })
  active: boolean;
}
