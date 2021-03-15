import { Schema } from 'mongoose';
import { HomeworkTables } from '../enums';

export const homeworkClassroomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  homework: {
    type: Schema.Types.ObjectId,
    ref: HomeworkTables.HOMEWORK,
    required: true,
  },
  duration: {
    type: String,
    required: false,
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: HomeworkTables.CLASSROOM,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});
