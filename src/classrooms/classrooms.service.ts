import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

//interfaces
import { Classroom } from './models/classroom.interface';

//DTOs
import { ClassroomDto } from './dto/classroom.dto';
import { AddStudentDto } from './dto/add-student.dto';
import { ClassroomCommentDto } from './dto/classroomComment.dto';
import { ClassroomTables, Field } from './enums';
import { ClassroomComment } from './models/classroom-comment.interface';
import { School, Student, Teacher } from 'src/users/models';
import { ClassroomEditDto } from './dto/classroom-edit.dto';
import { BannedStudent } from './models/banned-student.interface';
import { BanStudentDto } from './dto/ban-student.dto';
import { TopicsService } from 'src/topics/topics.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectModel(ClassroomTables.CLASSROOM)
    private readonly classroomModel: Model<Classroom>,
    @InjectModel(ClassroomTables.CLASSROOM_COMMENT)
    private readonly classroomCommentModel: Model<ClassroomComment>,
    @InjectModel(ClassroomTables.TEACHER)
    private readonly teacherModel: Model<Teacher>,
    @InjectModel(ClassroomTables.STUDENT)
    private readonly studentModel: Model<Student>,
    @InjectModel(ClassroomTables.SCHOOL)
    private readonly schoolModel: Model<School>,
    @InjectModel(ClassroomTables.BANNED_STUDENT)
    private readonly bannedStudentModel: Model<BannedStudent>,
    private topicsService: TopicsService,
    private usersService: UsersService,
  ) {}

  async createClassroom(classroomDto: ClassroomDto): Promise<Classroom> {
    try {
      const newClassroom: Classroom = await new this.classroomModel(
        classroomDto,
      ).save();
      const addClassroomToTeacher = await this.addClassroomTeacher(
        classroomDto.teacher,
        newClassroom._id,
      );
      if (addClassroomToTeacher === null) return null;
      return newClassroom;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getClassroom(classroomId: string): Promise<Classroom> {
    const classroom: Classroom = await this.classroomModel
      .findById(classroomId)
      .populate(Field.TEACHER, {}, ClassroomTables.TEACHER)
      .populate(Field.STUDENTS, {}, ClassroomTables.STUDENT)
      .populate(Field.SCHOOL, {}, ClassroomTables.SCHOOL)
      .populate(Field.TOPICS, {}, ClassroomTables.TOPIC);
    return classroom;
  }
  async updateClassroom(
    classroomId: string,
    classroomEditDto: ClassroomEditDto,
  ): Promise<Classroom> {
    const updatedClassroom: Classroom = await this.classroomModel
      .findByIdAndUpdate(classroomId, classroomEditDto, { new: true })
      .populate(Field.TEACHER, {}, ClassroomTables.TEACHER)
      .populate(Field.STUDENTS, {}, ClassroomTables.STUDENT)
      .populate(Field.SCHOOL, {}, ClassroomTables.SCHOOL)
      .populate(Field.TOPICS, {}, ClassroomTables.TOPIC);
    return updatedClassroom;
  }

  async deleteClassroom(classroomId: string): Promise<Classroom> {
    const deletedClassroom: Classroom = await this.classroomModel.findByIdAndDelete(
      classroomId,
    );
    return deletedClassroom;
  }

  async getClassrooms(classroomsIds: string[]): Promise<Classroom[]> {
    const classrooms: Classroom[] = await this.classroomModel.find({
      _id: { $in: classroomsIds },
    });
    return classrooms;
  }
  async removeStudent(removeStudentDto: AddStudentDto): Promise<Classroom> {
    const classroom: Classroom = await this.classroomModel.findByIdAndUpdate(
      removeStudentDto.classroomId,
      { $pull: { students: removeStudentDto.studentId } },
      { new: true },
    );
    return classroom;
  }

  async addClassroomComment(
    classroomId: string,
    classroomCommentDto: ClassroomCommentDto,
  ): Promise<Classroom> {
    try {
      const comment = new this.classroomCommentModel(classroomCommentDto);
      const classroom: Classroom = await this.classroomModel
        .findByIdAndUpdate(
          classroomId,
          { $push: { comments: comment } },
          { new: true },
        )
        .populate(Field.TEACHER, {}, ClassroomTables.TEACHER)
        .populate(Field.STUDENTS, {}, ClassroomTables.STUDENT)
        .populate(Field.SCHOOL, {}, ClassroomTables.SCHOOL)
        .populate(Field.TOPICS, {}, ClassroomTables.TOPIC);

      return classroom;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async removeClassroomComment(
    classroomId: string,
    comment: ClassroomCommentDto,
  ): Promise<Classroom> {
    const classroom: Classroom = await this.classroomModel
      .findByIdAndUpdate(
        classroomId,
        { $pull: { comments: comment } },
        { new: true },
      )
      .populate(Field.TEACHER, {}, ClassroomTables.TEACHER)
      .populate(Field.STUDENTS, {}, ClassroomTables.STUDENT)
      .populate(Field.SCHOOL, {}, ClassroomTables.SCHOOL)
      .populate(Field.TOPICS, {}, ClassroomTables.TOPIC);
    return classroom;
  }

  async removeClassroomTopic(
    classroomId: string,
    topicId: string,
  ): Promise<Classroom> {
    const classroom: Classroom = await this.classroomModel.findByIdAndUpdate(
      classroomId,
      { $pull: { topics: topicId } },
      { new: true },
    );
    return classroom;
  }

  async addClassroomTeacher(teacherId: string, classroomId: string) {
    try {
      await this.teacherModel.findByIdAndUpdate(teacherId, {
        $push: { classrooms: classroomId },
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addStudent(addStudentDto: AddStudentDto) {
    try {
      const student = await this.studentModel
        .findByIdAndUpdate(
          addStudentDto.studentId,
          {
            $addToSet: { classrooms: addStudentDto.classroomId },
          },
          { new: true },
        )
        .populate(Field.SCHOOL, {}, ClassroomTables.SCHOOL)
        .populate(Field.CLASSROOMS, {}, ClassroomTables.CLASSROOM);
      //notificar cambio a alumno
      const classroom = await this.classroomModel
        .findByIdAndUpdate(
          addStudentDto.classroomId,
          {
            $addToSet: { students: addStudentDto.studentId },
          },
          { new: true },
        )
        .populate(Field.TEACHER, {}, ClassroomTables.TEACHER)
        .populate(Field.STUDENTS, {}, ClassroomTables.STUDENT)
        .populate(Field.SCHOOL, {}, ClassroomTables.SCHOOL)
        .populate(Field.TOPICS, {}, ClassroomTables.TOPIC);
      //notificar cambio a salon

      console.log(classroom);
      console.log(student);
      return { classroom, student };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async banStudent(banStudentDto: BanStudentDto) {
    try {
      const newBannedStudent = await this.bannedStudentModel.findOneAndUpdate(
        { classroom: banStudentDto.classroom, student: banStudentDto.student },
        { active: true },
        { new: true },
      );
      if (!newBannedStudent) {
        const newBannedStudent = await new this.bannedStudentModel(
          banStudentDto,
        ).save();

        return newBannedStudent;
      }

      return newBannedStudent;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async unbanStudent(banStudentDto: BanStudentDto) {
    try {
      const newBannedStudent = await this.bannedStudentModel.findOneAndUpdate(
        { classroom: banStudentDto.classroom, student: banStudentDto.student },
        { active: false },
        { new: true },
      );

      return newBannedStudent;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getBannedStudents(classroomId: string) {
    try {
      const bannedStudents = await this.bannedStudentModel.find({
        classroom: classroomId,
      });
      return bannedStudents;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteEntireClassroom(classroomId: string) {
    try {
      const deletedTopics = await this.topicsService.deleteTopicsByClassroom(
        classroomId,
      );
      if (!deletedTopics) return null;
      const deletedClassroom = await this.classroomModel.findByIdAndDelete(
        classroomId,
      );
      if (!deletedClassroom) return null;
      const deletedFromUsers = await this.usersService.deleteAllClassroom(
        classroomId,
        deletedClassroom.teacher as string,
        deletedClassroom.students as string[],
      );
      if (!deletedFromUsers) return null;
      return deletedClassroom;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateLinkedClassroom(classroomId: string, link: string){
    // console.log(link, classroomId);
    try {
      console.log(link);
      const classroom = await this.getClassroom(classroomId);
      classroom.link = link;
      await classroom.save();
      // console.log(classroom);
      return classroom;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
