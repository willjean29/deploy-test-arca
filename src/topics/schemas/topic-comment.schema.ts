import { Schema } from 'mongoose';

export const topicCommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  profileImg: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: false,
  },
  link: {
    type: String,
    required: false,
  },
});
