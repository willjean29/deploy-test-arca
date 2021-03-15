import { Schema } from 'mongoose';

export const bookSchema = new Schema({
  name: {
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
  image: {
    type: String,
    required: true,
  },
});
