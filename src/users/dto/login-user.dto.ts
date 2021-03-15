import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { passwordMinLength , LoginErrors} from "../enums";


export class LoginUserDto{

    @IsEmail({},{message:LoginErrors.EMAIL,always:true})
    @IsNotEmpty({message:LoginErrors.EMAIL,always:true})
    email:string;

    @MinLength(passwordMinLength,{message:LoginErrors.PASSWORD,always:true})
    password:string;
}