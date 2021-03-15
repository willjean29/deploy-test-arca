import { IsNotEmpty } from 'class-validator';

export class ChangeSchoolDto {
  @IsNotEmpty({ message: 'Id incorrecto', always: true })
  userId: string;

  @IsNotEmpty({ message: 'Colegio incorrecto', always: true })
  schoolName: string;

  @IsNotEmpty({ message: 'Tipo incorrecto', always: true })
  userType: number;
}
