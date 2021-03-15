import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Res,
  Body,
  Param,
  HttpStatus,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';
import { diskStorage } from 'multer';
import { normalize, join } from 'path';
import { UsersGateway } from 'src/users/users.gateway';
import { UsersService } from 'src/users/users.service';
import { fileFilter } from 'src/utils';
import { EjercicioDownloadDto } from './dto/ejercicio-download.dto';
import { EjercicioDto } from './dto/ejercicio.dto';
import { EjerciciosService } from './ejercicios.service';
import { Ejercicio } from './models/ejercicio.interface';

@Controller('ejercicios')
export class EjerciciosController {
  constructor(
    private ejerciciosService: EjerciciosService,
    private usersService: UsersService,
    private usersGateway: UsersGateway,
  ) {}

  @Post('/create')
  async createEjercicio(
    @Res() res: Response,
    @Body() ejercicioDto: EjercicioDto,
  ) {
    const ejercicio: Ejercicio = await this.ejerciciosService.createEjercicio(
      ejercicioDto,
    );
    if (!ejercicio) throw new NotFoundException('Ejercicio can not be created');
    res.status(HttpStatus.OK).json({
      message: 'success',
      ejercicio,
    });
  }

  @Post('/create/many')
  async createEjercicios(
    @Res() res: Response,
    @Body() ejerciciosDto: EjercicioDto[],
  ) {
    const ejercicios: Ejercicio[] = await this.ejerciciosService.createEjercicios(
      ejerciciosDto,
    );
    if (!ejercicios)
      throw new NotFoundException('Ejercicios can not be created');
    res.status(HttpStatus.OK).json({
      message: 'success',
      ejercicios,
    });
  }

  @Get('/all')
  async getEjercicios(@Res() res: Response) {
    const ejercicios: Ejercicio[] = await this.ejerciciosService.getEjercicios();
    console.log(this.usersGateway.getConnectedUsers());
    if (!ejercicios)
      throw new NotFoundException('Ejercicio can not be created');
    res.status(HttpStatus.OK).json({
      message: 'success',
      ejercicios,
    });
  }

  @Post('/download')
  getClassroomFile(
    @Res() res: Response,
    @Body() ejercicioDownloadDto: EjercicioDownloadDto,
  ) {
    const user = this.usersService.searchTeacher(
      ejercicioDownloadDto.teacherId,
    );
    const { level, grade, number } = ejercicioDownloadDto;
    if (!user) throw new NotFoundException('Error al descargar ejercicio');
    res.download(
      join(
        process.cwd(),
        `./src/uploads/ejerciciosFiles/${level}-${grade}-${number}.zip`,
      ),
    );
  }
}
