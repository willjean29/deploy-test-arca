import { Document } from 'mongoose';
import { Book } from './book.interface';
export interface BookCode extends Document {
  book: string | Book;
  code: string;
  user?: string;
}
