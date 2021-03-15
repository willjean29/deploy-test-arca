import { Document } from "mongoose";
export interface School extends Document{

   
    readonly district:string;
  
    readonly province:string;
    
    readonly name:string;

    readonly insigne:string;
  
}