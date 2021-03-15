import { Document } from 'mongoose';
export interface Homework extends Document {
  readonly name: string;
  readonly course: string;
  readonly grade: string;
  readonly level: string;
  readonly teacher: string;
}
