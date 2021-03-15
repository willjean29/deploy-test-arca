import { Schema } from 'mongoose';
import { ExamTables } from '../enums';
export const answerExcerciseSchema = new Schema({
  excercise: {
    type: Schema.Types.ObjectId,
    ref: ExamTables.EXCERCISE,
    required: true,
  },
  correct: {
    type: Boolean,
    required: true,
  },
});
