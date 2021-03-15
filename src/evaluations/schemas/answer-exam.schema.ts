import { Schema } from 'mongoose';
import { ExamTables } from '../enums';
import { answerExcerciseSchema } from './answer-excercise.schema';

export const answerExamSchema = new Schema({
  examClassroom: {
    type: Schema.Types.ObjectId,
    ref: ExamTables.EXAM_CLASSROOM,
    required: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: ExamTables.STUDENT,
    required: true,
  },
  answers: [answerExcerciseSchema],
  correct: {
    type: Number,
    required: true,
  },
  incorrect: {
    type: Number,
    required: true,
  },
});
