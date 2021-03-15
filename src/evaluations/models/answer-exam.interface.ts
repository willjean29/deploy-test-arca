import { AnswerExcercise } from './answer-excercise.interface';
import { Document } from 'mongoose';
export interface AnswerExam extends Document {
  readonly student: string;
  readonly examClassroom: string;
  readonly answers: AnswerExcercise[];
  readonly correct: number;
  readonly incorrect: number;
}
