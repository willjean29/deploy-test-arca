import { Schema } from 'mongoose';
import { ExamTables } from '../enums';

export const examClassroomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  exam: {
    type: Schema.Types.ObjectId,
    ref: ExamTables.EXAM,
    required: true,
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: ExamTables.CLASSROOM,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  finishDate: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});
