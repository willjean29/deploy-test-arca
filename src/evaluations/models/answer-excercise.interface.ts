import { Document } from 'mongoose';
export interface AnswerExcercise extends Document {
  readonly excercise: string;
  readonly correct: boolean;
}
