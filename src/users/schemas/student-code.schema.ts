
import {Schema} from "mongoose"

export const studentRegisterCodeSchema = new Schema({
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