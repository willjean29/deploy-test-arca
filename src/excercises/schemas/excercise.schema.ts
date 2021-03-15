import { Schema } from 'mongoose';
import { ExcerciseTable } from '../enums';

export const excerciseSchema = new Schema({
  type: {
    type: Number,
    required: true,
  },
  statement: {
    type: String,
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  alternatives: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ExcerciseTable.ALTERNATIVE,
    },
  ],
  selectionAnswer: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: ExcerciseTable.ALTERNATIVE,
  },
  fillAnswer: {
    type: String,
    required: false,
  },
  dragGroups: [
    {
      type: String,
      required: false,
    },
  ],
  photo: {
    type: String,
    required: false,
  },
});
