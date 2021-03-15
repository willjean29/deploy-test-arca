import { Schema } from 'mongoose';
import { BookTables } from '../enums/tables.enum';

export const bookCodeSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: BookTables.BOOK,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: false,
  },
});
