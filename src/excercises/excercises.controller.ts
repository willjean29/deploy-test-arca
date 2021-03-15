import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ExcercisesService } from './excercises.service';
import { ExcerciseDto } from './dtos';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { imageFileFilter, normalize } from 'src/utils';
@Controller('excercises')
export class ExcercisesController {
  constructor(private readonly excercisesService: ExcercisesService) {}

  @Post()
  async newExcercise(@Res() res: Response, @Body() excerciseDto: ExcerciseDto) {
    const excercise = await this.excercisesService.newExcercise(excerciseDto);
    if (!excercise) throw new NotFoundException('Error al agregar ejercicio');
    res.status(HttpStatus.OK).json({
      message: 'success',
      excercise,
    });
  }

  @Get(':id')
  async getExcercise(@Res() res: Response, @Param('id') excerciseId: string) {
    const excercise = await this.excercisesService.getExcercise(excerciseId);
    if (!excercise)
      throw new NotFoundException('Error al obtener el ejercicio');
    res.status(HttpStatus.OK).json({
      message: 'success',
      excercise,
    });
  }

  @Get('/teacher/:id')
  async getExcercises(@Res() res: Response, @Param('id') teacherId: string) {
    const excercises = await this.excercisesService.getExcercises(teacherId);

    if (!excercises)
      throw new NotFoundException('Error al obtener los ejercicios');
    res.status(HttpStatus.OK).json({
      message: 'success',
      excercises,
    });
  }

  @Post('/upload/:hour')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/uploads/excerciseImages/',
        filename: (req, file, cb) => {
          const { hour } = req.params;
          cb(null, hour.concat(normalize(file.originalname)));
        },
      }),
      fileFilter: imageFileFilter,
      limits: { files: 1, fileSize: 10000000 },
    }),
  )
  async setExcerciseImage(
    @Res() res: Response,
    @UploadedFile() file,
    @Param('hour') hour: string,
  ) {
    res.status(HttpStatus.OK).json({
      message: 'success',
      photo: hour.concat(normalize(file.originalname)),
    });
  }

  @Get('/excercise-image/:id')
  getProfileImg(@Res() res: Response, @Param('id') excerciseId: string) {
    try {
      res.sendFile(
        join(process.cwd(), `/src/uploads/excerciseImages/${excerciseId}`),
        function(err) {
          res.status(HttpStatus.NOT_FOUND).end();
        },
      );
    } catch (error) {
      res.sendFile(null);
    }
  }

  @Post('/upload-multiple/')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      storage: diskStorage({
        destination: './src/uploads/excerciseImages/',
        filename: (req, file, cb) => {
          cb(
            null,
            Date.now()
              .toString()
              .concat(Math.round(Math.random() * 1e9).toString())
              .concat(normalize(file.originalname)),
          );
        },
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 10000000 },
    }),
  )
  async uploadMultiple(@Res() res: Response, @UploadedFiles() filesNames) {
    const files = filesNames.map(file => file.filename);
    res.status(HttpStatus.OK).json({
      message: 'success',
      files,
    });
  }
}
