import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersGateway } from './users.gateway';

import { UserTables } from './enums';

import {
  studentRegisterCodeSchema,
  teacherSchema,
  teacherRegisterCodeSchema,
  studentSchema,
} from './schemas';
import { schoolSchema } from './schemas/school.schema';
import { classroomSchema } from 'src/classrooms/schemas';
import { EmailService } from 'src/email/email.service';

@Module({
  providers: [UsersService, UsersGateway, EmailService],
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([
      { name: UserTables.TEACHER, schema: teacherSchema },
      { name: UserTables.STUDENT, schema: studentSchema },
      { name: UserTables.TEACHER_CODE, schema: teacherRegisterCodeSchema },
      { name: UserTables.STUDENT_CODE, schema: studentRegisterCodeSchema },
      { name: UserTables.SCHOOL, schema: schoolSchema },
      { name: UserTables.CLASSROOM, schema: classroomSchema },
    ]),
  ],
  exports: [UsersService, UsersGateway],
})
export class UsersModule {}
