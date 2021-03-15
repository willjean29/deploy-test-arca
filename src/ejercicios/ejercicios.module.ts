import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from 'src/users/users.module';

import { EjerciciosController } from './ejercicios.controller';
import { EjerciciosService } from './ejercicios.service';
import { EjercicioTables } from './enums/tables.enum';
import { ejercicioSchema } from './schemas/ejercicio.schema';

@Module({
  controllers: [EjerciciosController],
  providers: [EjerciciosService],
  imports: [
    MongooseModule.forFeature([
      { name: EjercicioTables.EJERCICIO, schema: ejercicioSchema },
    ]),
    UsersModule,
  ],
})
export class EjerciciosModule {}
