import { IsNotEmpty, IsOptional } from 'class-validator';
import { BookCodeError } from '../enums/book-errors.enum';

export class BookCodeDto {
  @IsNotEmpty({ message: BookCodeError.BOOK, always: true })
  book: string;

  @IsNotEmpty({ message: BookCodeError.CODE, always: true })
  code: string;

  @IsOptional()
  user?: string;
}
