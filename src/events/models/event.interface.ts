import { Document } from 'mongoose';
import { Classroom } from 'src/classrooms/models';
export interface Event extends Document {
  start: string;
  title: string;
  classroom: string | Classroom;
}
