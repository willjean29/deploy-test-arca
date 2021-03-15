import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { passwordMinLength, RegisterError } from '../enums';

export class RegisterUserDto {
  @IsString({ message: RegisterError.FIRST_NAME, always: true })
  @IsNotEmpty({ message: RegisterError.EMPTY_FIRST_NAME, always: true })
  firstName: string;

  @IsString({ message: RegisterError.LAST_NAME, always: true })
  @IsNotEmpty({ message: RegisterError.EMPTY_LAST_NAME, always: true })
  lastName: string;

  @IsString({ message: RegisterError.SCHOOL, always: true })
  @IsNotEmpty({ message: RegisterError.SCHOOL, always: true })
  schoolName: string;

  @IsString({ message: RegisterError.SCHOOL, always: true })
  @IsNotEmpty({ message: RegisterError.EMPTY_REGISTER_CODE, always: true })
  registerCode: string;

  @IsEmail({}, { message: RegisterError.EMAIL, always: true })
  @IsNotEmpty({ message: RegisterError.EMPTY_EMAIL, always: true })
  email: string;

  @IsNumber({}, { message: RegisterError.TYPE, always: true })
  type: number;

  @MinLength(passwordMinLength, {
    always: true,
    message: RegisterError.PASSWORD_LENGTH,
  })
  password: string;

  @IsString({ message: RegisterError.BIRTHDAY, always: true })
  @IsNotEmpty({ message: RegisterError.BIRTHDAY, always: true })
  birthday: string;
}
