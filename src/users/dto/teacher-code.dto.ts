import { IsBoolean, IsNotEmpty} from "class-validator";
import { TeacherCodeError } from "../enums";

export class TeacherCodeDto{
  
    @IsNotEmpty({message:TeacherCodeError.CODE})
    registerCode:string;

    @IsBoolean({message:TeacherCodeError.CODE})
    used:boolean;
}