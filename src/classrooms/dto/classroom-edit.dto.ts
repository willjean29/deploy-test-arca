import { IsNotEmpty } from 'class-validator';
import { ClassroomError } from '../enums';

export class ClassroomEditDto {
  @IsNotEmpty({ message: ClassroomError.COLOR, always: true })
  color: string;

  @IsNotEmpty({ message: ClassroomError.COURSE, always: true })
  course: string;

  @IsNotEmpty({ message: ClassroomError.GRADE, always: true })
  grade: string;

  @IsNotEmpty({ message: ClassroomError.SECTION, always: true })
  section: string;

  @IsNotEmpty({ message: ClassroomError.LEVEL, always: true })
  level: string;
}
