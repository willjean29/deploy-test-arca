import { Document } from 'mongoose';
import { Classroom } from 'src/classrooms/models';
import { Exam } from './exam.interface';

export interface ExamClassroom extends Document {
  readonly name: string;
  readonly classroom: string | Classroom;
  readonly exam: string | Exam;
  readonly active: boolean;
  readonly startDate: string;
  readonly finishDate: string;
}
