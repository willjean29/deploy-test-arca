import { IsEmail } from "class-validator";
import { UserDto } from "./user.dto";

export class StudentDto extends UserDto{

    @IsEmail({},{message:"Email del padre inválido"})
    parentEmail:string;
}