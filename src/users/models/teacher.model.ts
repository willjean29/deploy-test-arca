import { Document } from 'mongoose';
import { Classroom } from 'src/classrooms/models';
import { School } from './school.model';
export interface Teacher extends Document {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly type: number;
  password: string;
  readonly classrooms: string[] | Classroom[];
  readonly school: string | School;
  readonly dni: string;
  readonly levels: string[];
  readonly registerCode: string;
  readonly profileImg?: string;
  readonly birthday?: string;
}
