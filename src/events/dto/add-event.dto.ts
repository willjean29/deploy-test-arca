import { IsNotEmpty } from 'class-validator';
import { EventError } from '../enums/event-errors.enum';

export class AddEventDto {
  @IsNotEmpty({ message: EventError.NAME, always: true })
  title: string;

  @IsNotEmpty({ message: EventError.DATE, always: true })
  start: string;

  @IsNotEmpty({ message: EventError.CLASSROOM, always: true })
  classroom: string;
}
