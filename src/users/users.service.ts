import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
//interfaces

//DTOs
import { LoginUserDto } from './dto/login-user.dto';
import { UserDto } from './dto/user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { AddClassroomDto } from './dto/addClassroom.dto';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { TeacherCodeDto } from './dto/teacher-code.dto';
import { Field, UserTables, UserType } from './enums';
import { Student, Teacher, TeacherCode, StudentCode, School } from './models';
import { SchoolDto, StudentCodeDto } from './dto';
import { Classroom } from 'src/classrooms/models';
import { Cron } from '@nestjs/schedule';
import { UsersGateway } from './users.gateway';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { EmailService } from 'src/email/email.service';
import { ChangeSchoolDto } from './dto/changeSchool.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserTables.TEACHER)
    private readonly teacherModel: Model<Teacher>,
    @InjectModel(UserTables.TEACHER_CODE)
    private readonly teacherCodeModel: Model<TeacherCode>,
    @InjectModel(UserTables.STUDENT_CODE)
    private readonly studentCodeModel: Model<StudentCode>,
    @InjectModel(UserTables.STUDENT)
    private readonly studentModel: Model<Student>,
    @InjectModel(UserTables.SCHOOL)
    private readonly schoolModel: Model<School>,
    @InjectModel(UserTables.CLASSROOM)
    private readonly classroomModel: Model<Classroom>,
    private usersGateway: UsersGateway,
    private emailService: EmailService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.loginStudent(loginUserDto);
    if (user) {
      return user;
    } else {
      const user = await this.loginTeacher(loginUserDto);
      if (user) return user;
      return null;
    }
  }

  async loginTeacher(loginUserDto: LoginUserDto) {
    try {
      const teacher = await this.teacherModel
        .findOne(loginUserDto)
        .populate(Field.SCHOOL, {}, UserTables.SCHOOL)
        .populate(Field.CLASSROOMS, {}, UserTables.CLASSROOM)
        .select('-password');
      return teacher;
    } catch (error) {
      return null;
    }
  }

  async loginStudent(loginUserDto: LoginUserDto) {
    try {
      const student = await this.studentModel
        .findOne(loginUserDto)
        .populate(Field.SCHOOL, {}, UserTables.SCHOOL)
        .populate(Field.CLASSROOMS, {}, UserTables.CLASSROOM)
        .select('-password');
      return student;
    } catch (error) {
      return null;
    }
  }

  async registerTeacher(registerTeacherDto: RegisterTeacherDto) {
    const teacherCode: TeacherCode = await this.getTeacherCode(
      registerTeacherDto.registerCode,
    );
    if (!teacherCode) return null;
    const school: School = await this.getSchool(registerTeacherDto.schoolName);
    if (!school) return null;
    await this.teacherCodeModel.findOneAndUpdate(
      { registerCode: registerTeacherDto.registerCode },
      { used: true },
    );
    const newTeacher: Teacher = await new this.teacherModel({
      ...registerTeacherDto,
      registerCode: teacherCode._id,
      school: school._id,
    }).save();
    return newTeacher;
  }

  async registerStudent(registerStudentDto: RegisterStudentDto) {
    const studentCode: StudentCode = await this.getStudentCode(
      registerStudentDto.registerCode,
    );
    if (!studentCode) return null;
    const school: School = await this.getSchool(registerStudentDto.schoolName);
    if (!school) return null;
    const newStudent: Student = await new this.studentModel({
      ...registerStudentDto,
      registerCode: studentCode._id,
      school: school._id,
    }).save();
    await this.studentCodeModel.findOneAndUpdate(
      { registerCode: registerStudentDto.registerCode },
      { used: true },
    );
    return newStudent;
  }

  async getSchool(schoolName: string) {
    try {
      const school = await this.schoolModel.findOne({
        name: schoolName,
      });
      if (!school) return null;
      return school;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getTeacherCode(registerCode: string) {
    try {
      const teacherCode = await this.teacherCodeModel.findOne({
        registerCode,
      });
      if (teacherCode?.used) return null;
      return teacherCode;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getStudentCode(registerCode: string) {
    try {
      const studentCode = await this.studentCodeModel.findOne({
        registerCode,
      });
      if (studentCode?.used) return null;
      return studentCode;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addTeacherRegisterCode(teacherCodeDto: TeacherCodeDto) {
    try {
      const newRegisterCode = await this.teacherCodeModel.create(
        teacherCodeDto,
      );
      return newRegisterCode.save();
    } catch (error) {
      return null;
    }
  }

  async addStudentRegisterCode(studentCodeDto: StudentCodeDto) {
    try {
      const newRegisterCode = await this.studentCodeModel.create(
        studentCodeDto,
      );
      return newRegisterCode.save();
    } catch (error) {
      return null;
    }
  }

  async addSchool(schoolDto: SchoolDto) {
    try {
      const newSchool = await this.schoolModel.create(schoolDto);
      return newSchool.save();
    } catch (error) {
      return null;
    }
  }

  async getSchools() {
    try {
      const schools = await this.schoolModel.find();
      return schools;
    } catch (error) {
      return null;
    }
  }
  async getUsers(schoolName: string) {
    try {
      const teachers = await this.teacherModel.find({ school: schoolName });
      const students = await this.studentModel.find({ school: schoolName });
      const users = [
        ...teachers.map(teacher => teacher.email),
        ...students.map(student => student.email),
      ];
      return users;
    } catch (error) {
      return null;
    }
  }

  async updateSchoolInsigne(schoolId: string) {
    try {
      const newSchool = await this.schoolModel.findByIdAndUpdate(
        schoolId,
        { insigne: `http://localhost:4000/users/school/insigne/${schoolId}` },
        { new: true },
      );
      return newSchool;
    } catch (error) {
      return null;
    }
  }

  async updateUserProfileImg(userId: string) {
    const user = await this.updateStudentPhoto(userId);
    if (user) {
      return user;
    } else {
      const user = await this.updateTeacherPhoto(userId);
      if (user) return user;
      return null;
    }
  }

  async updateTeacherPhoto(userId: string) {
    try {
      const newUser = await this.teacherModel.findByIdAndUpdate(
        userId,
        {
          profileImg: `http://localhost:4000/users/profile/${userId}`,
        },
        { new: true },
      );
      this.usersGateway.sendChangesToTeacher(newUser);
      return newUser;
    } catch (error) {
      return null;
    }
  }

  async updateStudentPhoto(userId: string) {
    try {
      const newUser = await this.studentModel.findByIdAndUpdate(
        userId,
        {
          profileImg: `http://localhost:4000/users/profile/${userId}`,
        },
        { new: true },
      );
      this.usersGateway.sendChangesToStudent(newUser);
      return newUser;
    } catch (error) {
      return null;
    }
  }

  async updateUserPassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.changePasswordTeacher(changePasswordDto);
    if (user) {
      return user;
    } else {
      const user = await this.changePasswordStudent(changePasswordDto);
      if (user) return user;
      return null;
    }
  }

  async changePasswordTeacher(changePasswordDto: ChangePasswordDto) {
    try {
      const newUser = await this.teacherModel.findOneAndUpdate(
        {
          password: changePasswordDto.oldPassword,
          _id: changePasswordDto.userId,
        },
        { password: changePasswordDto.newPassword },
        { new: true },
      );
      return newUser;
    } catch (error) {
      return null;
    }
  }

  async changePasswordStudent(changePasswordDto: ChangePasswordDto) {
    try {
      const newUser = await this.studentModel.findOneAndUpdate(
        {
          password: changePasswordDto.oldPassword,
          _id: changePasswordDto.userId,
        },
        { password: changePasswordDto.newPassword },
        { new: true },
      );
      return newUser;
    } catch (error) {
      return null;
    }
  }

  @Cron('* * * * * *', {
    name: 'clock',
  })
  clock() {
    const clock = moment()
      .locale('es')
      .format('MMMM Do YYYY, h:mm:ss a');
    this.usersGateway.sendClock(clock);
  }

  async getConnectedUsers() {
    const usersArray = this.usersGateway.getConnectedUsers();
    console.log(usersArray);
    let users = [] as string[];
    usersArray.forEach(async user => {
      let newUser = await this.searchStudent(user);
      if (newUser === null) {
        newUser = await this.searchTeacher(user);
      }
      users.push(newUser);
    });
    return users;
  }

  async searchTeacher(teacherId: string) {
    try {
      const teacher = await this.teacherModel.findById(teacherId);
      return teacher.firstName + ' ' + teacher.lastName;
    } catch (error) {
      return null;
    }
  }

  async searchStudent(studentId: string) {
    try {
      const student = await this.studentModel.findById(studentId);
      return student.firstName + ' ' + student.lastName;
    } catch (error) {
      return null;
    }
  }

  async getPassword(email: string) {
    try {
      const existsTeacher = await this.teacherModel.findOne({ email });
      const existsStudent = await this.studentModel.findOne({ email });

      const userExists = existsTeacher !== null ? existsTeacher : existsStudent;

      if (userExists !== null) {
        const res = await this.emailService.sendEmailPassword(
          userExists.email,
          userExists.password,
        );
        return 'Enviado';
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getBirthdays(classroomId: string) {
    const students = await this.studentModel.find({ classrooms: classroomId });
    const teacher = await this.teacherModel.find({ classrooms: classroomId });

    const users = [...students, ...teacher];
    return users;
  }

  async editSchoolTeacher(teacherId: string, schoolName: string) {
    try {
      const school: School = await this.getSchool(schoolName);
      if (!school) return null;

      const newTeacher = await this.teacherModel
        .findByIdAndUpdate(teacherId, { school: school._id }, { new: true })
        .populate(Field.SCHOOL, {}, UserTables.SCHOOL)
        .populate(Field.CLASSROOMS, {}, UserTables.CLASSROOM)
        .select('-password');

      return newTeacher;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async editSchoolStudent(studentId: string, schoolName: string) {
    try {
      const school: School = await this.getSchool(schoolName);
      if (!school) return null;

      const newStudent = await this.studentModel
        .findByIdAndUpdate(studentId, { school: school._id }, { new: true })
        .populate(Field.SCHOOL, {}, UserTables.SCHOOL)
        .populate(Field.CLASSROOMS, {}, UserTables.CLASSROOM)
        .select('-password');

      return newStudent;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async changeSchool(changeSchoolDto: ChangeSchoolDto) {
    if (changeSchoolDto.userType === UserType.TEACHER) {
      return this.editSchoolTeacher(
        changeSchoolDto.userId,
        changeSchoolDto.schoolName,
      );
    }
    if (changeSchoolDto.userType === UserType.STUDENT) {
      return this.editSchoolStudent(
        changeSchoolDto.userId,
        changeSchoolDto.schoolName,
      );
    }
  }

  async deleteAllClassroom(
    classroomId: string,
    teacherId: string,
    studentsIds: string[],
  ) {
    try {
      const deletedFromTeacher = await this.deleteClassroomFromTeacher(
        teacherId,
        classroomId,
      );
      if (!deletedFromTeacher) return null;
      studentsIds.forEach(async student => {
        try {
          await this.deleteClassroomFromStudent(student, classroomId);
          this.usersGateway.sendDeletedClassroomToClient(classroomId);
          console.log('deleted');
        } catch (error) {
          console.log(error);
        }
      });
      return 'deleted';
    } catch (error) {
      return null;
    }
  }

  async deleteClassroomFromStudent(userId: string, classroomId: string) {
    try {
      const deletedStudent = await this.studentModel.findByIdAndUpdate(userId, {
        $pull: { classrooms: classroomId },
      });
      return deletedStudent;
    } catch (error) {
      return null;
    }
  }

  async deleteClassroomFromTeacher(userId: string, classroomId: string) {
    try {
      const deletedTeacher = await this.teacherModel.findByIdAndUpdate(userId, {
        $pull: { classrooms: classroomId },
      });
      return deletedTeacher;
    } catch (error) {
      return null;
    }
  }
}
