import { IsNotEmpty } from 'class-validator';
import { ClassroomError } from '../enums';

export class ClassroomDto {
  @IsNotEmpty({ message: ClassroomError.STUDENTS, always: true })
  students: string[];

  @IsNotEmpty({ message: ClassroomError.TOPICS, always: true })
  topics: string[];

  @IsNotEmpty({ message: ClassroomError.COLOR, always: true })
  color: string;

  @IsNotEmpty({ message: ClassroomError.TEACHER, always: true })
  teacher: string;

  @IsNotEmpty({ message: ClassroomError.COURSE, always: true })
  course: string;

  @IsNotEmpty({ message: ClassroomError.SCHOOL, always: true })
  school: string;

  @IsNotEmpty({ message: ClassroomError.GRADE, always: true })
  grade: string;

  @IsNotEmpty({ message: ClassroomError.SECTION, always: true })
  section: string;

  @IsNotEmpty({ message: ClassroomError.LEVEL, always: true })
  level: string;

  @IsNotEmpty({ message: ClassroomError.INSIGNIA, always: true })
  insignia: string;
}
