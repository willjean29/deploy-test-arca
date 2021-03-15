import { Schema } from 'mongoose';
import { HomeworkTables } from '../enums/tables.enum';

export const homeworkSchema = new Schema({
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
    ref: HomeworkTables.TEACHER,
    required: true,
  },
});
