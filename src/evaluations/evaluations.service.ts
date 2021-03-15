import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ExamDto } from './dto/exam.dto';
import { Exam } from './models/exam.interface';
import { ExamTables, Field, HomeworkTables } from './enums';
import { Homework } from './models/homework.interface';
import { HomeworkDto } from './dto/homework.dto';
import { ExcerciseTable } from 'src/excercises/enums';
import { Excercise, Alternative } from 'src/excercises/models';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ExamClassroom } from './models/exam-class.interface';
import { ExamClassroomDto } from './dto/exam-classroom.dto';
import { HomeworkClassroom } from './models/homework-class.interface';
import { HomeworkClassroomDto } from './dto/homework-classroom.dto';
import { Classroom } from 'src/classrooms/models';
import { UsersGateway } from 'src/users/users.gateway';
import { AnswerExamDto } from './dto/answer-exam.dto';
import { AnswerExam } from './models/answer-exam.interface';
import { Student } from 'src/users/models';
import { MessagingGateway } from 'src/messaging/messaging.gateway';
import { MessageDto } from 'src/messaging/dto/message.dto';
import { ClassroomTables } from 'src/classrooms/enums';
import * as moment from 'moment';
import { MessagingService } from 'src/messaging/messaging.service';
import { EmailService } from 'src/email/email.service';
import { StartExamDto } from './dto/start-exam.dto';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectModel(ExamTables.EXAM)
    private readonly examModel: Model<Exam>,
    @InjectModel(HomeworkTables.HOMEWORK)
    private readonly homeworkModel: Model<Homework>,
    @InjectModel(ExcerciseTable.EXCERCISE)
    private readonly excerciseModel: Model<Excercise>,
    @InjectModel(ExcerciseTable.ALTERNATIVE)
    private readonly alternativeModel: Model<Alternative>,
    @InjectModel(ExamTables.EXAM_CLASSROOM)
    private readonly examClassroomModel: Model<ExamClassroom>,
    @InjectModel(HomeworkTables.HOMEWORK_CLASSROOM)
    private readonly homeworkClassroomModel: Model<HomeworkClassroom>,
    @InjectModel(ExamTables.CLASSROOM)
    private readonly classroomModel: Model<Classroom>,
    @InjectModel(ExamTables.ANSWER_EXAM)
    private readonly answerExamModel: Model<AnswerExam>,
    @InjectModel(ExamTables.STUDENT)
    private readonly studentModel: Model<Student>,
    private schedulerRegistry: SchedulerRegistry,
    private usersGateway: UsersGateway,
    private messagingGateway: MessagingGateway,
    private messagingService: MessagingService,
    private emailService: EmailService,
  ) {}
  async createExam(examDto: ExamDto) {
    try {
      const newExam: Exam = await new this.examModel(examDto).save();

      return newExam;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createHomework(homeworkDto: HomeworkDto) {
    try {
      const newHomework: Homework = await new this.homeworkModel(
        homeworkDto,
      ).save();

      return newHomework;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getExams(teacherId: string) {
    try {
      const exams = await this.examModel.find({ teacher: teacherId });

      return exams;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteExam(examId: string) {
    try {
      const exam = await this.examModel.findByIdAndDelete(examId);

      return exam;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteExamClassroom(examClassroomId: string) {
    try {
      const exam = await this.examClassroomModel.findByIdAndDelete(
        examClassroomId,
      );

      return exam;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getExam(examId: string) {
    try {
      const exam = await this.examModel.findById(examId).populate({
        path: Field.EXCERCISES,
        model: ExamTables.EXCERCISE,
        populate: {
          path: Field.ALTERNATIVES,
          model: ExamTables.ALTERNATIVE,
        },
      });
      return exam;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getHomeworks(teacherId: string) {
    try {
      const homeworks = await this.homeworkModel.find({ teacher: teacherId });

      return homeworks;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addExamClassroom(examClassroomDto: ExamClassroomDto) {
    try {
      const newExamClassroom = await new this.examClassroomModel(
        examClassroomDto,
      ).save();
      const classroom = await this.classroomModel
        .findById(newExamClassroom.classroom as string)
        .populate(Field.STUDENTS, {}, ClassroomTables.STUDENT);

      (classroom.students as Student[]).forEach(async student => {
        const messageDto: MessageDto = {
          receptor: student.email,
          sender: 'ARCA VIRTUAL',
          date: moment()
            .locale('es')
            .format('LLL'),
          read: false,
          subject: 'EVALUACION',
          messageText: `<p> Tiene la siguiente evaluación: ${
            newExamClassroom.name
          }, con fecha ${moment(newExamClassroom.startDate, 'MMMM Do YYYY')
            .locale('es')
            .format('MMMM Do YYYY')} en el salón de ${classroom.course.concat(
            ' - ' + classroom.grade + '° ' + classroom.section,
          )}</p>`,
        };
        const message = await this.messagingService.newMessage(messageDto);
        this.messagingGateway.sendMessageEvaluationToClient(message);
        const res = await this.emailService.sendEmailEvaluation(
          student.parentEmail,
          messageDto,
        );
      });
      return newExamClassroom;
    } catch (error) {
      return null;
    }
  }

  async addHomeworkClassroom(homeworkClassroomDto: HomeworkClassroomDto) {
    try {
      const newHomeworkClassroom = await new this.homeworkClassroomModel(
        homeworkClassroomDto,
      ).save();

      return newHomeworkClassroom;
    } catch (error) {
      return null;
    }
  }

  async getExamsClassroom(classroomId: string) {
    try {
      const examsClassroom = await this.examClassroomModel.find({
        classroom: classroomId,
      });
      return examsClassroom;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getHomeworksClassroom(classroomId: string) {
    try {
      const homeworksClassroom = await this.homeworkClassroomModel.find({
        classroom: classroomId,
      });
      return homeworksClassroom;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getExamClassroom(examClassroomId: string) {
    try {
      const examClassroom = await this.examClassroomModel.findById(
        examClassroomId,
      );
      return examClassroom;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async startExamClassroom(
    examClassroomId: string,
    startExamDto: StartExamDto,
  ) {
    try {
      const examClassroom = await this.examClassroomModel.findByIdAndUpdate(
        examClassroomId,
        {
          active: true,
          startDate: startExamDto.startDate,
          finishDate: startExamDto.finishDate,
        },
        { new: true },
      );
      const classroom = await this.classroomModel.findById(
        examClassroom.classroom as string,
      );

      (classroom.students as string[]).forEach(student => {
        this.usersGateway.sendExamNotificationStart(examClassroom, student);
      });

      return examClassroom;
    } catch (error) {
      return null;
    }
  }

  async finishExamClassroom(examClassroomId: string) {
    try {
      const examClassroom = await this.examClassroomModel.findByIdAndUpdate(
        examClassroomId,
        { active: false },
        { new: true },
      );
      const classroom = await this.classroomModel.findById(
        examClassroom.classroom as string,
      );

      (classroom.students as string[]).forEach(student => {
        this.usersGateway.sendExamNotificationFinish(examClassroom, student);
      });
      return examClassroom;
    } catch (error) {
      return null;
    }
  }

  async sendExamClassroomAnswer(answerExamDto: AnswerExamDto) {
    try {
      const alreadyAnswered = await this.answerExamModel.findOne({
        student: answerExamDto.student,
        examClassroom: answerExamDto.examClassroom,
      });
      if (alreadyAnswered === null) {
        const newAnswerExam = await new this.answerExamModel(
          answerExamDto,
        ).save();

        return newAnswerExam;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getExamsClassroomsAnswers(examClassroomId: string) {
    try {
      const examsClassroomsAnswers = await this.answerExamModel
        .find({
          examClassroom: examClassroomId,
        })
        .populate(Field.STUDENT, {}, ExamTables.STUDENT)
        .populate(Field.EXAM_CLASSROOM, {}, ExamTables.EXAM_CLASSROOM);
      return examsClassroomsAnswers;
    } catch (error) {
      return null;
    }
  }

  async deleteExamsClassroom(classroomId: string) {
    try {
      const deletedExamsClassroom = await this.examClassroomModel.deleteMany({
        classroom: classroomId,
      });

      return deletedExamsClassroom;
    } catch (error) {
      return null;
    }
  }
}
