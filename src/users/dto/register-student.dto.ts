
import { IsEmail, IsNotEmpty } from "class-validator";
import { RegisterError } from "../enums";
import { RegisterUserDto } from "./register-user.dto";


export class RegisterStudentDto extends RegisterUserDto{
    
    @IsEmail({},{message:RegisterError.PARENT_EMAIL,always:true})
    @IsNotEmpty({message:RegisterError.EMPTY_PARENT_MAIL,always:true})
    parentEmail:string;

}

