import { Document } from 'mongoose';
export interface BannedStudent extends Document {
  readonly classroom: string;
  readonly active: boolean;
  readonly student: string;
}
