import { Document } from "mongoose";
export interface TeacherCode extends Document{

   
   readonly registerCode:string;
   readonly used:boolean;
  
}