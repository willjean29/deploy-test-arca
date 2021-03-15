
import { IsArray, IsNotEmpty, IsNumberString, IsString, MinLength } from "class-validator";
import { dniMinLength, RegisterError } from "../enums";
import { RegisterUserDto } from "./register-user.dto";


export class RegisterTeacherDto extends RegisterUserDto{

    
    @IsNotEmpty({message:RegisterError.EMPTY_LEVELS,always:true})
    @IsString({message:RegisterError.EMPTY_LEVELS,always:true,each:true})
    levels:string[];

    @IsNumberString({},{message:RegisterError.DNI,always:true})
    @MinLength(dniMinLength,{message:RegisterError.DNI,always:true})
    @IsNotEmpty({message:RegisterError.EMPTY_DNI,always:true})
    dni:string;

}