import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ExcerciseError } from '../enums/excercise-errors.enum';
import { AlternativeDto } from './alternative.dto';

export class ExcerciseDto {
  @IsNumber({}, { message: ExcerciseError.EXCERCISE_TYPE, always: true })
  type: number;

  @IsNotEmpty({ message: ExcerciseError.EXCERCISE_STATEMENT, always: true })
  statement: string;

  @IsNotEmpty({ message: ExcerciseError.ALTERNATIVE_LENGTH, always: true })
  alternatives: AlternativeDto[];

  @IsOptional()
  @IsNotEmpty({ message: ExcerciseError.SELECTION_ANSWER, always: true })
  selectionAnswer?: string; //Llega en texto y se compara el texto con el id de la creada y se guarda el id

  @IsOptional()
  @IsNotEmpty({ message: ExcerciseError.FILL_ANSWER, always: true })
  fillAnswer?: string;

  @IsOptional()
  @IsNotEmpty({ message: ExcerciseError.DRAG_GROUPS, always: true })
  dragGroups?: string[];

  @IsNotEmpty({ message: ExcerciseError.TEACHER, always: true })
  teacher: string;

  @IsNotEmpty({ message: ExcerciseError.COURSE, always: true })
  course: string;

  @IsOptional()
  @IsNotEmpty({ message: ExcerciseError.PHOTO, always: true })
  photo?: string;
}
