import { Schema } from 'mongoose';

export const ejercicioSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  preview: {
    type: String,
    required: true,
  },
  capacity: [
    {
      type: String,
      required: true,
    },
  ],
  capability: {
    type: String,
    required: true,
  },
  performance: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});
