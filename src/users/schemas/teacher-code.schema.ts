
import {Schema} from "mongoose"

export const teacherRegisterCodeSchema = new Schema({
    registerCode:{
        type:String,
        required:true,
        unique:true
    },
    used:{ 
        type:Boolean,
        required:true
    },
});