import { Schema } from 'mongoose';

export const alternativeSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  dragGroup: {
    type: Number,
    required: false,
  },
  photo: {
    type: String,
    required: false,
  },
});
