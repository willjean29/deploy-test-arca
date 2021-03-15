import { IsNotEmpty } from 'class-validator';
import { BookError } from '../enums/book-errors.enum';

export class BookDto {
  @IsNotEmpty({ message: BookError.NAME, always: true })
  name: string;

  @IsNotEmpty({ message: BookError.GRADE, always: true })
  grade: string;

  @IsNotEmpty({ message: BookError.LEVEL, always: true })
  level: string;

  @IsNotEmpty({ message: BookError.IMAGE, always: true })
  image: string;
}
