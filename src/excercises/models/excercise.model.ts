import { Document } from 'mongoose';
export interface Excercise extends Document {
  readonly type: number;
  readonly statement: string;
  readonly alternatives: string[];
  readonly teacher: string;
  readonly selectionAnswer?: string;
  readonly fillAnswer?: string;
  readonly dragGroups?: string[];
  readonly course: string;
  readonly photo?: string;
}
