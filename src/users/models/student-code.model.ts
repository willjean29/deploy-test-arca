import { Document } from "mongoose";
export interface StudentCode extends Document{

   
   readonly registerCode:string;
   readonly used:boolean;
  
}