import { Document } from 'mongoose';
import { Classroom } from 'src/classrooms/models';

import { Homework } from './homework.interface';

export interface HomeworkClassroom extends Document {
  readonly name: string;
  readonly classroom: string | Classroom;
  readonly homework: string | Homework;
  readonly duration?: string;
  readonly active: boolean;
  readonly startDate: string;
}
