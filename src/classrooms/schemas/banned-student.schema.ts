import { Schema, SchemaTypes } from 'mongoose';
import { ClassroomTables } from '../enums';

export const bannedStudentSchema = new Schema({
  classroom: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: ClassroomTables.CLASSROOM,
  },
  student: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: ClassroomTables.STUDENT,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});
