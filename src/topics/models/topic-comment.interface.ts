import { Document } from 'mongoose';
import { Student, Teacher } from 'src/users/models';

export interface TopicComment extends Document {
  author: Teacher | Student | string;
  comment: string;
  date: string;
  name: string;
  type: number;
  profileImg: string;
  file?: string;
  link?: string;
}
