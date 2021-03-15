import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ClassroomsGateway } from './classrooms.gateway';
import { ClassroomsController } from './classrooms.controller';
import { ClassroomsService } from './classrooms.service';

import { classroomSchema } from './schemas/classroom.schema';
import { ClassroomTables } from './enums';

import { teacherSchema } from '../users/schemas/teacher.schema';
import { studentSchema } from '../users/schemas/student.schema';
import { classroomCommentSchema } from './schemas/classroom-comment.schema';
import { schoolSchema } from 'src/users/schemas/school.schema';
import { UsersGateway } from 'src/users/users.gateway';
import { bannedStudentSchema } from './schemas/banned-student.schema';
import { UsersModule } from 'src/users/users.module';
import { TopicsModule } from 'src/topics/topics.module';

@Module({
  providers: [ClassroomsService, ClassroomsGateway, UsersGateway],
  controllers: [ClassroomsController],
  imports: [
    MongooseModule.forFeature([
      { name: ClassroomTables.CLASSROOM, schema: classroomSchema },
      { name: ClassroomTables.TEACHER, schema: teacherSchema },
      { name: ClassroomTables.STUDENT, schema: studentSchema },
      {
        name: ClassroomTables.CLASSROOM_COMMENT,
        schema: classroomCommentSchema,
      },
      { name: ClassroomTables.SCHOOL, schema: schoolSchema },
      { name: ClassroomTables.BANNED_STUDENT, schema: bannedStudentSchema },
    ]),
    UsersModule,
    TopicsModule,
  ],
  exports: [ClassroomsService, ClassroomsGateway],
})
export class ClassroomsModule {}
