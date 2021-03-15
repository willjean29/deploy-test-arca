import { Schema } from 'mongoose';

export const messageSchema = new Schema({
  sender: {
    type: String,
    required: true,
  },
  receptor: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
  messageText: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: false,
  },
});
