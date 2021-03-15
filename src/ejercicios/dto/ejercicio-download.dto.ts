import { IsNotEmpty } from 'class-validator';
import { EjercicioErrors } from '../enums/ejercicio-error.enum';
export class EjercicioDownloadDto {
  @IsNotEmpty({ message: EjercicioErrors.USER, always: true })
  teacherId: string;

  @IsNotEmpty({ message: EjercicioErrors.LEVEL, always: true })
  level: string;

  @IsNotEmpty({ message: EjercicioErrors.GRADE, always: true })
  grade: string;

  @IsNotEmpty({ message: EjercicioErrors.NUMBER, always: true })
  number: string;
}
