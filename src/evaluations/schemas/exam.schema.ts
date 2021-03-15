import { Schema } from 'mongoose';
import { ExamTables } from '../enums/tables.enum';

export const examSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: ExamTables.TEACHER,
    required: true,
  },
  excercises: [
    {
      type: Schema.Types.ObjectId,
      ref: ExamTables.EXCERCISE,
      required: true,
    },
  ],
});
