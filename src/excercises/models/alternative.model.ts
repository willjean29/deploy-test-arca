import { Document } from 'mongoose';
export interface Alternative extends Document {
  readonly text: string;
  readonly dragGroup?: number;
  readonly photo?: string;
}
