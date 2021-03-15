import { Document } from 'mongoose';
import { Topic } from 'src/topics/models/topic.interface';
import { School, Student, Teacher } from 'src/users/models';
import { ClassroomComment } from './classroom-comment.interface';
export interface Classroom extends Document {
  readonly students: Student[] | string[];
  readonly topics: Topic[] | string[];
  readonly comments: ClassroomComment[] | string[];
  readonly teacher: Teacher | string;
  readonly color: string;
  readonly school: School | string;
  readonly course: string;
  readonly grade: string;
  readonly level: string;
  readonly section: string;
  readonly insignia: string;
  link: string;
}
