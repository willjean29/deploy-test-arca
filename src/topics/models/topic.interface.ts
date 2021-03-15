import { Document } from 'mongoose';
import { Classroom } from 'src/classrooms/models';
export interface Topic extends Document {
  readonly classroom: string | Classroom;
  readonly comments: any[];
  readonly topic: string;
  readonly description: string;
}
