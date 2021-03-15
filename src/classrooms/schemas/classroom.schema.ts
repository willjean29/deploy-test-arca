import { Schema } from 'mongoose';
import { ClassroomTables } from '../enums';
import { classroomCommentSchema } from './classroom-comment.schema';

export const classroomSchema = new Schema({
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: ClassroomTables.STUDENT,
      required: true,
    },
  ],
  teacher: {
    type: Schema.Types.ObjectId,
    ref: ClassroomTables.TEACHER,
    required: true,
  },
  topics: [
    {
      type: Schema.Types.ObjectId,
      ref: ClassroomTables.TOPIC,
      required: true,
    },
  ],
  comments: [classroomCommentSchema],
  color: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: ClassroomTables.SCHOOL,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  insignia: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false
  }
});

//poner middlewares
