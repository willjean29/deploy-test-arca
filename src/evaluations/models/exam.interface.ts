import { Document } from 'mongoose';
import { Excercise } from 'src/excercises/models';
export interface Exam extends Document {
  readonly name: string;
  readonly course: string;
  readonly grade: string;
  readonly level: string;
  readonly teacher: string;
  readonly excercises: string[] | Excercise[];
}
