import { IsNotEmpty } from 'class-validator';
import { BookCodeError } from '../enums/book-errors.enum';

export class AddBookDto {
  @IsNotEmpty({ message: BookCodeError.CODE, always: true })
  code: string;

  @IsNotEmpty({ message: BookCodeError.USER, always: true })
  user: string;
}
