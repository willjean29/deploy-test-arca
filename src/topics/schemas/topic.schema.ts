import { Schema } from 'mongoose';
import { topicCommentSchema } from './topic-comment.schema';

export const topicSchema = new Schema({
  classroom: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  comments: [topicCommentSchema],
  topic: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
