import { Document } from 'mongoose';
export interface Book extends Document {
  name: string;
  grade: string;
  level: string;
  image: string;
}
