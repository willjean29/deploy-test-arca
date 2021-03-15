import { IsNotEmpty } from 'class-validator';
import { PasswordError } from '../enums/password-errors.enum';

export class ChangePasswordDto {
  @IsNotEmpty({ message: PasswordError.USER_ID, always: true })
  userId: string;

  @IsNotEmpty({ message: PasswordError.NEW_PASSWORD, always: true })
  newPassword: string;

  @IsNotEmpty({ message: PasswordError.OLD_PASSWORD, always: true })
  oldPassword: string;
}
