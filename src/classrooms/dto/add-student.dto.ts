import { IsNotEmpty } from 'class-validator';
import { ClassroomError } from '../enums';

export class AddStudentDto {
  @IsNotEmpty({ message: ClassroomError.CLASSROOM_ID, always: true })
  classroomId: string;

  @IsNotEmpty({ message: ClassroomError.STUDENT_ID, always: true })
  studentId: string;
}
