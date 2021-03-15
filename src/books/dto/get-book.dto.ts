import { IsNotEmpty, IsOptional } from 'class-validator';
import { BookCodeError } from '../enums/book-errors.enum';

export class GetBookDto {
  @IsNotEmpty({ message: BookCodeError.BOOK, always: true })
  user: string;

  @IsNotEmpty({ message: BookCodeError.CODE, always: true })
  code: string;
}
