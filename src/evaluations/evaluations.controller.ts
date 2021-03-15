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
} from '@nestjs/common';

import { Response } from 'express';
import { ClassroomsGateway } from 'src/classrooms/classrooms.gateway';
import { AnswerExamDto } from './dto/answer-exam.dto';
import { ExamClassroomDto } from './dto/exam-classroom.dto';
import { ExamDto } from './dto/exam.dto';
import { HomeworkClassroomDto } from './dto/homework-classroom.dto';
import { HomeworkDto } from './dto/homework.dto';
import { StartExamDto } from './dto/start-exam.dto';
import { EvaluationsService } from './evaluations.service';
import { ExamClassroom } from './models/exam-class.interface';
import { Exam } from './models/exam.interface';
import { Homework } from './models/homework.interface';

@Controller('evaluations')
export class EvaluationsController {
  constructor(
    private evaluationsService: EvaluationsService,
    private classroomsGateway: ClassroomsGateway,
  ) {}
  @Post('/exam/create')
  async createExam(@Res() res: Response, @Body() examDto: ExamDto) {
    const exam: Exam = await this.evaluationsService.createExam(examDto);
    if (!exam) throw new NotFoundException('Exam can not be created');
    res.status(HttpStatus.OK).json({
      message: 'success',
      exam,
    });
  }
  @Post('/homework/create')
  async createHomework(@Res() res: Response, @Body() homeworkDto: HomeworkDto) {
    const homework: Homework = await this.evaluationsService.createHomework(
      homeworkDto,
    );
    if (!homework) throw new NotFoundException('Homework can not be created');
    res.status(HttpStatus.OK).json({
      message: 'success',
      homework,
    });
  }

  @Get('/exam/:id')
  async getExams(@Res() res: Response, @Param('id') teacherId: string) {
    const exams: Exam[] = await this.evaluationsService.getExams(teacherId);
    if (!exams) throw new NotFoundException('No hay exámenes');
    res.status(HttpStatus.OK).json({
      message: 'success',
      exams,
    });
  }

  @Delete('/exam/:id')
  async deleteExam(@Res() res: Response, @Param('id') examId: string) {
    const exam = await this.evaluationsService.deleteExam(examId);
    if (!exam) throw new NotFoundException('No hay exámenes');
    res.status(HttpStatus.OK).json({
      message: 'success',
      exam,
    });
  }

  @Get('/homework/:id')
  async getHomeworks(@Res() res: Response, @Param('id') teacherId: string) {
    const homeworks: Homework[] = await this.evaluationsService.getHomeworks(
      teacherId,
    );
    if (!homeworks) throw new NotFoundException('No hay tareas');
    res.status(HttpStatus.OK).json({
      message: 'success',
      homeworks,
    });
  }

  @Post('/exam/classroom')
  async addExamClassroom(
    @Res() res: Response,
    @Body() examClassroomDto: ExamClassroomDto,
  ) {
    const examClassroom = await this.evaluationsService.addExamClassroom(
      examClassroomDto,
    );
    if (!examClassroom)
      throw new NotFoundException('Error al agregar examen a classroom');
    res.status(HttpStatus.OK).json({
      message: 'success',
      examClassroom,
    });
  }

  @Post('/homework/classroom')
  async addHomeworkClassroom(
    @Res() res: Response,
    @Body() homeworkClassroomDto: HomeworkClassroomDto,
  ) {
    const homeworkClassroom = await this.evaluationsService.addHomeworkClassroom(
      homeworkClassroomDto,
    );
    if (!homeworkClassroom)
      throw new NotFoundException('Error al agregar tarea a classroom');
    res.status(HttpStatus.OK).json({
      message: 'success',
      homeworkClassroom,
    });
  }

  @Get('/exam/classroom/:id')
  async getExamsClassroom(
    @Res() res: Response,
    @Param('id') classroomId: string,
  ) {
    const examsClassroom = await this.evaluationsService.getExamsClassroom(
      classroomId,
    );
    if (!examsClassroom) return new NotFoundException('No hay exámenes');
    res.status(HttpStatus.OK).json({
      message: 'success',
      examsClassroom,
    });
  }

  @Get('/homework/classroom/:id')
  async getHomeworksClassroom(
    @Res() res: Response,
    @Param('id') classroomId: string,
  ) {
    const homeworksClassroom = await this.evaluationsService.getHomeworksClassroom(
      classroomId,
    );
    if (!homeworksClassroom) return new NotFoundException('No hay tareas');
    res.status(HttpStatus.OK).json({
      message: 'success',
      homeworksClassroom,
    });
  }

  @Get('/exam/get/:id')
  async getExam(@Res() res: Response, @Param('id') examId: string) {
    const exam: Exam = await this.evaluationsService.getExam(examId);
    if (!exam) throw new NotFoundException('No hay examen');
    res.status(HttpStatus.OK).json({
      message: 'success',
      exam,
    });
  }

  @Get('/exam/classroom/get/:id')
  async getExamClassroom(
    @Res() res: Response,
    @Param('id') examClassroomId: string,
  ) {
    const examClassroom: ExamClassroom = await this.evaluationsService.getExamClassroom(
      examClassroomId,
    );
    if (!examClassroom) throw new NotFoundException('No hay examen');
    res.status(HttpStatus.OK).json({
      message: 'success',
      examClassroom,
    });
  }

  @Post('/exam/classroom/start/:id')
  async startExamClassroom(
    @Res() res: Response,
    @Param('id') examClassroomId: string,
    @Body() startExamDto: StartExamDto,
  ) {
    const examClassroom: ExamClassroom = await this.evaluationsService.startExamClassroom(
      examClassroomId,
      startExamDto,
    );
    if (!examClassroom) throw new NotFoundException('No hay examen');
    res.status(HttpStatus.OK).json({
      message: 'success',
      examClassroom,
    });
  }

  @Get('/exam/classroom/finish/:id')
  async finishExamClassroom(
    @Res() res: Response,
    @Param('id') examClassroomId: string,
  ) {
    const examClassroom: ExamClassroom = await this.evaluationsService.finishExamClassroom(
      examClassroomId,
    );
    if (!examClassroom) throw new NotFoundException('No hay examen');
    res.status(HttpStatus.OK).json({
      message: 'success',
      examClassroom,
    });
  }

  @Post('/exam/answer')
  async sendExamClassroomAnswer(
    @Res() res: Response,
    @Body() answerExamDto: AnswerExamDto,
  ) {
    const answerExam = await this.evaluationsService.sendExamClassroomAnswer(
      answerExamDto,
    );

    if (!answerExam)
      throw new NotFoundException('Error al registrar la respuesta del examen');
    res.status(HttpStatus.OK).json({
      message: 'success',
      answerExam,
    });
  }

  @Get('/exam/answers/:id')
  async getExamsClassroomsAnswers(
    @Res() res: Response,
    @Param('id') examClassroomId: string,
  ) {
    const examsClassroomsAnswers = await this.evaluationsService.getExamsClassroomsAnswers(
      examClassroomId,
    );
    if (!examsClassroomsAnswers)
      throw new NotFoundException('No hay respuestas');
    res.status(HttpStatus.OK).json({
      message: 'success',
      examsClassroomsAnswers,
    });
  }

  @Delete('/exam/classroom/:id')
  async deleteExamClassroom(
    @Res() res: Response,
    @Param('id') examClassroomId: string,
  ) {
    const examClassroom = await this.evaluationsService.deleteExamClassroom(
      examClassroomId,
    );
    if (!examClassroom) throw new NotFoundException('No hay examen de salon');
    res.status(HttpStatus.OK).json({
      message: 'success',
      examClassroom,
    });
    this.classroomsGateway.sendExamClassroomDeleted(examClassroom);
  }

  @Delete('/delete/classroom/:id')
  async deleteExamsByClassroom(
    @Res() res: Response,
    @Param('id') classroomId: string,
  ) {
    const deletedExams = await this.evaluationsService.deleteExamsClassroom(
      classroomId,
    );
    if (!deletedExams)
      throw new NotFoundException('Error al eliminar examenes');
    res.status(HttpStatus.OK).json({
      success: true,
      deletedExams,
    });
  }
}
