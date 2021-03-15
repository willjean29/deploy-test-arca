import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcerciseTable } from './enums';
import { ExcercisesController } from './excercises.controller';
import { ExcercisesService } from './excercises.service';
import { alternativeSchema } from './schemas/alternative.schema';
import { excerciseSchema } from './schemas/excercise.schema';

@Module({
  controllers: [ExcercisesController],
  providers: [ExcercisesService],
  imports:[
    MongooseModule.forFeature([
      {name:ExcerciseTable.EXCERCISE,schema:excerciseSchema},
      {name:ExcerciseTable.ALTERNATIVE,schema:alternativeSchema}
    ])
  ]
})
export class ExcercisesModule {}
