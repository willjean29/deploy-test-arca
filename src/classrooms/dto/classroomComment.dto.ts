import { IsNotEmpty, IsOptional } from 'class-validator';
import { ClassroomError } from '../enums';

export class ClassroomCommentDto {
  @IsNotEmpty({ message: ClassroomError.AUTHOR, always: true })
  author: string;

  @IsNotEmpty({ message: ClassroomError.COMMENT, always: true })
  comment: string;

  @IsNotEmpty({ message: ClassroomError.DATE, always: true })
  date: string;

  @IsNotEmpty({ message: ClassroomError.NAME, always: true })
  name: string;

  @IsNotEmpty({ message: ClassroomError.TYPE, always: true })
  type: number;

  @IsNotEmpty({ message: ClassroomError.PROFILE_IMG, always: true })
  profileImg: string;

  @IsOptional()
  @IsNotEmpty({ message: ClassroomError.FILE, always: true })
  file?: string;

  @IsOptional()
  @IsNotEmpty({ message: ClassroomError.LINK, always: true })
  link?: string;
}
