import { Schema } from "mongoose";


export const schoolSchema = new Schema({
    district:{
        type:String,
        required:true
    },
    province:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    insigne:{
        type:String,
        required:true
    } 
   
});