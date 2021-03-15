import { Schema } from 'mongoose';

export const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  classroom: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
