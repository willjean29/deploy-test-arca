import { IsBoolean, IsNotEmpty} from "class-validator";
import { StudentCodeError } from "../enums";

export class StudentCodeDto{
  
    @IsNotEmpty({message:StudentCodeError.CODE})
    registerCode:string;

    @IsBoolean({message:StudentCodeError.CODE})
    used:boolean;
}