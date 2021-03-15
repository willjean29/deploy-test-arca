import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EjercicioDto } from './dto/ejercicio.dto';
import { EjercicioTables } from './enums/tables.enum';
import { Ejercicio } from './models/ejercicio.interface';

@Injectable()
export class EjerciciosService {
  constructor(
    @InjectModel(EjercicioTables.EJERCICIO)
    private readonly ejercicioModel: Model<Ejercicio>,
  ) {}

  async createEjercicio(ejercicioDto: EjercicioDto) {
    try {
      const newEjercicio: Ejercicio = await new this.ejercicioModel(
        ejercicioDto,
      ).save();

      return newEjercicio;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createEjercicios(ejerciciosDto: EjercicioDto[]) {
    try {
      const newEjercicios: Ejercicio[] = await this.ejercicioModel.insertMany(
        ejerciciosDto,
      );

      return newEjercicios;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getEjercicios() {
    try {
      const ejercicios: Ejercicio[] = await this.ejercicioModel.find();

      return ejercicios;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
