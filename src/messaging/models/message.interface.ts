import { Document } from 'mongoose';

export interface Message extends Document {
  sender: string;
  receptor: string;
  read: boolean;
  subject: string;
  messageText: string;
  file?: string;
  date: string;
}
