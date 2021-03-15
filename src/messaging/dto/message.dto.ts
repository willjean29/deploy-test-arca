import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageError } from '../enums';

export class MessageDto {
  @IsNotEmpty({ message: MessageError.SENDER })
  sender: string;

  @IsNotEmpty({ message: MessageError.RECEPTOR })
  receptor: string;

  @IsNotEmpty({ message: MessageError.READ })
  read: boolean;

  @IsNotEmpty({ message: MessageError.SUBJECT })
  subject: string;

  @IsNotEmpty({ message: MessageError.TEXT })
  messageText: string;

  @IsOptional()
  @IsNotEmpty({ message: MessageError.TEXT })
  file?: string;

  @IsNotEmpty({ message: MessageError.DATE })
  date: string;
}
