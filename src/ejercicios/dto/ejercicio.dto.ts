import { IsNotEmpty } from 'class-validator';
import { EjercicioErrors } from '../enums/ejercicio-error.enum';

export class EjercicioDto {
  @IsNotEmpty({ message: EjercicioErrors.TYPE, always: true })
  type: string;

  @IsNotEmpty({ message: EjercicioErrors.TITLE, always: true })
  title: string;

  @IsNotEmpty({ message: EjercicioErrors.DESCRIPTION, always: true })
  description: string;

  @IsNotEmpty({ message: EjercicioErrors.LEVEL, always: true })
  level: string;

  @IsNotEmpty({ message: EjercicioErrors.COURSE, always: true })
  course: string;

  @IsNotEmpty({ message: EjercicioErrors.GRADE, always: true })
  grade: string;

  @IsNotEmpty({ message: EjercicioErrors.PREVIEW, always: true })
  preview: string;

  @IsNotEmpty({ message: EjercicioErrors.CAPABILITY, always: true })
  capability: string;

  @IsNotEmpty({ message: EjercicioErrors.CAPACITY, always: true })
  capacity: string[];

  @IsNotEmpty({ message: EjercicioErrors.PERFORMANCE, always: true })
  performance: string;

  @IsNotEmpty({ message: EjercicioErrors.DATE, always: true })
  date: string;

  @IsNotEmpty({ message: EjercicioErrors.NUMBER, always: true })
  number: string;

  @IsNotEmpty({ message: EjercicioErrors.ACTIVE, always: true })
  active: boolean;
}
