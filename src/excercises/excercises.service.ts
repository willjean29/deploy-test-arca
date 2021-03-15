import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExcerciseTable,Field } from './enums';
import { Excercise,Alternative } from './models';
import {ExcerciseDto} from './dtos'
import { AlternativeDto } from './dtos/alternative.dto';


@Injectable()
export class ExcercisesService {
    constructor(@InjectModel(ExcerciseTable.EXCERCISE) private readonly excerciseModel:Model<Excercise>,
    @InjectModel(ExcerciseTable.ALTERNATIVE) private readonly alternativeModel:Model<Alternative>){}


    async newExcercise(excerciseDto:ExcerciseDto){

        try {
            const alternatives = excerciseDto.alternatives.map((alternative)=>new this.alternativeModel(alternative));
            const newAlternatives = await this.alternativeModel.insertMany(alternatives);
            const alternatives_ids = newAlternatives.map((alternative)=>alternative._id);
            const newExcercise = await new this.excerciseModel({
                ...excerciseDto,
                alternatives:alternatives_ids,
                selectionAnswer:(excerciseDto.type===1?newAlternatives.filter((alternative)=>alternative.text===excerciseDto.selectionAnswer)[0]._id:undefined),
                fillAnswer:(excerciseDto.type===3)?excerciseDto.fillAnswer:undefined
            }).save();
            return newExcercise;
        } catch (error) {
            console.log(error);
            return null;
        }
       
    }

    async getExcercise(excerciseId:string){
        try {
            const excercise = await this.excerciseModel.findById(excerciseId).populate(Field.ALTERNATIVE,{},ExcerciseTable.ALTERNATIVE).populate(Field.SELECTION_ANSWER,{},ExcerciseTable.ALTERNATIVE);
            return excercise;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getExcercises(teacherId:string){
        try {
            const excercises = await this.excerciseModel.find({teacher:teacherId}).populate(Field.ALTERNATIVE,{},ExcerciseTable.ALTERNATIVE).populate(Field.SELECTION_ANSWER,{},ExcerciseTable.ALTERNATIVE);;
            
            return excercises;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    
}
