import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';
import { classroomSchema } from 'src/classrooms/schemas';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { ExcerciseTable } from 'src/excercises/enums';
import { alternativeSchema } from 'src/excercises/schemas/alternative.schema';
import { excerciseSchema } from 'src/excercises/schemas/excercise.schema';
import { MessagingGateway } from 'src/messaging/messaging.gateway';
import { MessagingService } from 'src/messaging/messaging.service';
import { messageSchema } from 'src/messaging/schema/message.schema';
import { studentSchema, teacherSchema } from 'src/users/schemas';
import { UsersGateway } from 'src/users/users.gateway';
import { ExamTables, HomeworkTables } from './enums';
import { EvaluationsController } from './evaluations.controller';
import { EvaluationsGateway } from './evaluations.gateway';
import { EvaluationsService } from './evaluations.service';
import { answerExamSchema } from './schemas/answer-exam.schema';
import { answerExcerciseSchema } from './schemas/answer-excercise.schema';
import { examClassroomSchema } from './schemas/exam-classroom.schema';
import { examSchema } from './schemas/exam.schema';
import { homeworkClassroomSchema } from './schemas/homework-classroom.schema';
import { homeworkSchema } from './schemas/homework.schema';

@Module({
  controllers: [EvaluationsController],
  providers: [
    EvaluationsService,
    EvaluationsGateway,
    UsersGateway,
    MessagingGateway,
    MessagingService,
    EmailService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: ExamTables.EXAM, schema: examSchema },
      { name: HomeworkTables.HOMEWORK, schema: homeworkSchema },
      { name: ExamTables.EXAM_CLASSROOM, schema: examClassroomSchema },
      {
        name: HomeworkTables.HOMEWORK_CLASSROOM,
        schema: homeworkClassroomSchema,
      },
      { name: ExcerciseTable.EXCERCISE, schema: excerciseSchema },
      { name: ExcerciseTable.ALTERNATIVE, schema: alternativeSchema },
      { name: ExamTables.CLASSROOM, schema: classroomSchema },
      { name: ExamTables.ANSWER_EXAM, schema: answerExamSchema },
      { name: ExamTables.ANSWER_EXCERCISE, schema: answerExcerciseSchema },
      { name: ExamTables.STUDENT, schema: studentSchema },
      { name: ExamTables.TEACHER, schema: teacherSchema },
      { name: ExamTables.MESSAGE, schema: messageSchema },
    ]),
    ClassroomsModule,
  ],
})
export class EvaluationsModule {}
