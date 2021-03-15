import { IsNotEmpty, IsOptional } from 'class-validator';
import { ExcerciseError } from '../enums/excercise-errors.enum';

export class AlternativeDto {
  @IsNotEmpty({ message: ExcerciseError.ALTERNATIVE_LENGTH, always: true })
  text: string;

  @IsOptional()
  @IsNotEmpty({ message: ExcerciseError.EXCERCISE_STATEMENT, always: true })
  dragGroup?: number;

  @IsOptional()
  @IsNotEmpty({ message: ExcerciseError.EXCERCISE_STATEMENT, always: true })
  photo?: string;
}
