import { Document } from 'mongoose';

export interface Ejercicio extends Document {
  type: string;
  title: string;
  description: string;
  level: string;
  course: string;
  grade: string;
  preview: string;
  capability: string;
  capacity: string[];
  performance: string;
  date: string;
  number: string;
  active: boolean;
}
