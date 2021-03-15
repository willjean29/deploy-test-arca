import { IsArray, IsNotEmpty, IsNumberString, IsString, MinLength } from "class-validator";
import { RegisterError, dniMinLength } from "../enums";
import { UserDto } from "./user.dto";

export class TeacherDto extends UserDto{
    
    @IsArray({message:RegisterError.EMPTY_LEVELS,always:true})
    @IsNotEmpty({message:RegisterError.EMPTY_LEVELS,always:true})
    @IsString({message:RegisterError.EMPTY_LEVELS,always:true,each:true})
    levels:string[];

    @IsNumberString({},{message:RegisterError.DNI,always:true})
    @MinLength(dniMinLength,{message:RegisterError.DNI,always:true})
    @IsNotEmpty({message:RegisterError.EMPTY_DNI,always:true})
    dni:string;
    
}