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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';

import { ClassroomsGateway } from './classrooms.gateway';
import { ClassroomsService } from './classrooms.service';

import { ClassroomDto } from './dto/classroom.dto';
import { AddStudentDto } from './dto/add-student.dto';
import { ClassroomCommentDto } from './dto/classroomComment.dto';
import { Classroom } from './models/classroom.interface';
import { ClassroomTopicDto } from './dto/classroomTopic.dto';
import { GetClassroomsDto } from './dto/get-classrooms.dto';

import { UsersGateway } from 'src/users/users.gateway';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, normalize } from 'src/utils';
import { join } from 'path';
import * as fs from 'fs';
import { ClassroomEditDto } from './dto/classroom-edit.dto';
import { BanStudentDto } from './dto/ban-student.dto';
import { updateLocale } from 'moment';
@Controller('classrooms')
export class ClassroomsController {
  constructor(
    private classroomsGateway: ClassroomsGateway,
    private classroomsService: ClassroomsService,
    private usersGateway: UsersGateway,
  ) {}
  @Post('/create')
  async createClassroom(
    @Res() res: Response,
    @Body() classroomDto: ClassroomDto,
  ) {
    const classroom: Classroom = await this.classroomsService.createClassroom(
      classroomDto,
    );
    if (!classroom) throw new NotFoundException('Classroom can not be created');
    res.status(HttpStatus.OK).json({
      message: 'success',
      classroom,
    });
  }

  @Post()
  async getClassrooms(
    @Res() res: Response,
    @Body() getClassroomsDto: GetClassroomsDto,
  ) {
    const classrooms: Classroom[] = await this.classroomsService.getClassrooms(
      getClassroomsDto.classrooms,
    );
    if (!classrooms)
      throw new NotFoundException('Classrooms were not delivered');
    res.status(HttpStatus.OK).json({
      message: 'success',
      classrooms,
    });
  }

  @Get('/:id')
  async getClassroom(@Res() res: Response, @Param('id') classroomId: string) {
    const classroom: Classroom = await this.classroomsService.getClassroom(
      classroomId,
    );
    if (!classroom) throw new NotFoundException('Classroom does not exist');
    res.status(HttpStatus.OK).json({
      message: 'success',
      classroom,
    });
  }

  @Put('/edit/:id')
  async updateClassroom(
    @Res() res: Response,
    @Body() classroomDto: ClassroomEditDto,
    @Param('id') classroomId: string,
  ) {
    const classroom: Classroom = await this.classroomsService.updateClassroom(
      classroomId,
      classroomDto,
    );

    if (!classroom) throw new NotFoundException('Classroom was not updated');
    res.status(HttpStatus.OK).json({
      message: 'success',
      classroom,
    });
    this.classroomsGateway.sendClassroomToClient(classroom);
  }

  @Delete('/delete/:id')
  async deleteTeacherClassroom(
    @Res() res: Response,
    @Param('id') classroomId: string,
  ) {
    const classroom: Classroom = await this.classroomsService.deleteClassroom(
      classroomId,
    );
    if (!classroom) throw new NotFoundException('Classroom was not deleted');
    res.status(HttpStatus.OK).json({
      message: 'success',
      classroom,
    });
  }

  @Delete('/delete/all/:id')
  async deleteAllTeacherClassrooms(
    @Res() res: Response,
    @Param('id') classroomId: string,
  ) {
    const classroom: Classroom = await this.classroomsService.deleteClassroom(
      classroomId,
    );
    if (!classroom) throw new NotFoundException('Classroom was not deleted');
    res.status(HttpStatus.OK).json({
      message: 'success',
      classroom,
    });
  }

  @Post('/addstudent')
  async addStudent(@Res() res: Response, @Body() addStudentDto: AddStudentDto) {
    const { classroom, student } = await this.classroomsService.addStudent(
      addStudentDto,
    );
    if (!classroom) throw new NotFoundException(['User was not added']);
    if (!student) throw new NotFoundException(['User was not added']);
    res.status(HttpStatus.OK).json({
      message: 'success',
      classroom,
    });
    this.classroomsGateway.sendClassroomToClient(classroom);
    this.usersGateway.sendClassroomToStudent(classroom, student._id); //notificar cambio a los que estan escuchando el id
  }

  @Get('/addstudent/:ids')
  async addStudentGet(@Res() res: Response, @Param('ids') ids: string) {
    const addStudentDto = {
      classroomId: ids.slice(0, 24),
      studentId: ids.slice(24, 48),
    };

    const { classroom, student } = await this.classroomsService.addStudent(
      addStudentDto,
    );
    if (!classroom) throw new NotFoundException(['User was not added']);
    if (!student) throw new NotFoundException(['User was not added']);
    res.status(HttpStatus.OK).send(`<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Te has unido </title>
    </head>
    <body>
        <style>
          .welcome-centered{
            max-width: 500px;
            width: 100%;
            padding: 20px;
          }
            h3{
                color: #333;
                font-size: 16px;
            }
        </style>
       <div class="welcome-centered">
        <h3>Te has unido al salon</h3>
       </div>
    </body>
    </html>`);
    this.classroomsGateway.sendClassroomToClient(classroom);
    this.usersGateway.sendClassroomToStudent(classroom, student._id); //notificar cambio a los que estan escuchando el id
  }

  @Delete('/removestudent')
  async removeStudent(
    @Res() res: Response,
    @Body() removeStudentDto: AddStudentDto,
  ) {
    const classroom: Classroom = await this.classroomsService.removeStudent(
      removeStudentDto,
    );
    if (!classroom) throw new NotFoundException('User was not deleted');
    res.status(HttpStatus.OK).json({
      message: 'success',
      classroom,
    });
    this.classroomsGateway.sendClassroomToClient(classroom); //notificar cambio a los que estan escuchando el id
  }

  @Post('/addcomment/:id')
  async addClassroomComment(
    @Res() res: Response,
    @Param('id') classroomId: string,
    @Body() classroomComment: ClassroomCommentDto,
  ) {
    const classroom: Classroom = await this.classroomsService.addClassroomComment(
      classroomId,
      classroomComment,
    );
    if (!classroom) throw new NotFoundException('Comment was not added');
    res.status(HttpStatus.OK).json({
      message: 'success',
      classroom,
    });
    this.classroomsGateway.sendClassroomToClient(classroom); //notificar cambio a los que estan escuchando el id
  }

  @Post('/removecomment/:id')
  async removeClassroomComment(
    @Res() res: Response,
    @Param('id') classroomId: string,
    @Body() comment: ClassroomCommentDto,
  ) {
    const classroom: Classroom = await this.classroomsService.removeClassroomComment(
      classroomId,
      comment,
    );
    if (!classroom) throw new NotFoundException('Comment was not deleted');
    res.status(HttpStatus.OK).json({
      message: 'success',
      classroom,
    });
    this.classroomsGateway.sendClassroomToClient(classroom); //notificar cambio a los que estan escuchando el id
  }

  @Delete('/deletetopic/:id')
  async deleteClassroomTopic(
    @Res() res: Response,
    @Param() classroomId: string,
    @Body() classroomTopicDto: ClassroomTopicDto,
  ) {
    const classroom: Classroom = await this.classroomsService.removeClassroomTopic(
      classroomId,
      classroomTopicDto.topicId,
    );
    if (!classroom)
      throw new NotFoundException('Topic was not deleted from the classroom');
    res.status(HttpStatus.OK).json({
      message: 'success',
      classroom,
    });
    this.classroomsGateway.sendClassroomToClient(classroom); //notificar cambio a los que estan escuchando el id
  }

  @Post('/upload/:hour&:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { id } = req.params;
          const path = `./src/uploads/classrooms/${id}`;
          fs.mkdirSync(path, { recursive: true });
          return cb(null, path);
        },
        filename: (req, file, cb) => {
          const { hour } = req.params;
          cb(
            null,
            hour.concat(normalize(file.originalname).replace(/\s+/g, '')),
          );
        },
      }),
      fileFilter: fileFilter,
      limits: { files: 1, fileSize: 10000000 },
      //10mb
    }),
  )
  async uploadClassroomFile(@Res() res: Response, @UploadedFile() file) {
    res.status(HttpStatus.OK).json({
      message: 'sucess',
      file: normalize(file.originalname).replace(/\s+/g, ''),
    });
  }

  @Get('/download/:classroomId&:fileName')
  getClassroomFile(
    @Res() res: Response,
    @Param('classroomId') classroomId: string,
    @Param('fileName') fileName: string,
  ) {
    res.download(
      join(
        process.cwd(),
        `./src/uploads/classrooms/${classroomId}/${normalize(fileName)}`,
      ),
    );
  }

  @Post('/ban')
  async banStudent(@Res() res: Response, @Body() banStudentDto: BanStudentDto) {
    const bannedStudent = await this.classroomsService.banStudent(
      banStudentDto,
    );
    if (!bannedStudent) throw new NotFoundException('User was not banned');
    res.status(HttpStatus.OK).json({
      message: 'success',
      bannedStudent,
    });
    this.classroomsGateway.sendBannedUsersToClient(bannedStudent);
  }

  @Post('/unban')
  async unbanStudent(
    @Res() res: Response,
    @Body() banStudentDto: BanStudentDto,
  ) {
    const unbannedStudent = await this.classroomsService.unbanStudent(
      banStudentDto,
    );
    if (!unbannedStudent) throw new NotFoundException('User was not banned');
    res.status(HttpStatus.OK).json({
      message: 'success',
      unbannedStudent,
    });
    this.classroomsGateway.sendBannedUsersToClient(unbannedStudent);
  }

  @Get('/ban/:id')
  async getBannedStudents(
    @Res() res: Response,
    @Param('id') classroomId: string,
  ) {
    const bannedStudents = await this.classroomsService.getBannedStudents(
      classroomId,
    );
    if (!bannedStudents)
      throw new NotFoundException('Error al obtener usuarios baneados');
    res.status(HttpStatus.OK).json({
      message: 'success',
      bannedStudents,
    });
    // this.classroomsGateway.sendClassroomToClient(classroom); //notificar cambio a los que estan escuchando el id
  }

  @Delete('/delete/entire/:id')
  async deleteEntireClassroom(
    @Res() res: Response,
    @Param('id') classroomId: string,
  ) {
    const deletedClassroom = await this.classroomsService.deleteEntireClassroom(
      classroomId,
    );
    if (!deletedClassroom)
      throw new NotFoundException('Error al obtener usuarios baneados');
    res.status(HttpStatus.OK).json({
      success: true,
      deletedClassroom,
    });
    // this.classroomsGateway.sendClassroomToClient(classroom); //notificar cambio a los que estan escuchando el id
  }
  @Put('/link/:id')
  async updateLinkedClassroom(
    @Res() res: Response,
    @Body() body,
    @Param('id') classroomId: string,
  ){
    console.log("endpoint for link");
    const {link} = body;
    const classroom = await this.classroomsService.updateLinkedClassroom(classroomId,link);
    if (!classroom) throw new NotFoundException('Classroom was not updated');
    res.status(HttpStatus.OK).json({
      message: 'success',
      classroom,
    });
    this.classroomsGateway.sendClassroomToClient(classroom);
  }
}
