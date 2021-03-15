import { IsNotEmpty } from 'class-validator';
import { ClassroomError } from '../enums';

export class BanStudentDto {
  @IsNotEmpty({ message: ClassroomError.CLASSROOM_ID, always: true })
  classroom: string;

  @IsNotEmpty({ message: ClassroomError.STUDENT_ID, always: true })
  student: string;
}
