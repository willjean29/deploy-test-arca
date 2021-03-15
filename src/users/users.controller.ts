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
  HttpException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';

import { UsersService } from './users.service';
import { UsersGateway } from './users.gateway';
import {
  TeacherCodeDto,
  RegisterStudentDto,
  RegisterTeacherDto,
  StudentCodeDto,
  LoginUserDto,
  SchoolDto,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { imageFileFilter } from 'src/utils';
import { Student, Teacher } from './models';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ChangeSchoolDto } from './dto/changeSchool.dto';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private usersGateway: UsersGateway,
  ) {}

  //     @Put('/edit/:id')
  //     async editUser(@Res() res:Response,@Param('id') userId:string, @Body() editUserDto:EditUserDto){
  //         const user = await this.userService.editUser(userId,editUserDto);
  //         if(!user) throw new NotFoundException('User was not updated');
  //         res.status(HttpStatus.OK).json({
  //             message:'success',
  //             user
  //         });
  //     }

  //     @Post('/getstudents')
  //     async getStudents(@Res() res:Response, @Body() getUsersDto:GetUsersDto){
  //         const students = await this.userService.getUsers(getUsersDto.students);
  //         if(!students) throw new NotFoundException('Users do not exist');
  //         res.status(HttpStatus.OK).json({
  //             message:'success',
  //             students
  //         });
  //     }

  //     @Post('/addclassroom')
  //     async addClassroom(@Res() res:Response,@Body() addClassroomDto:AddClassroomDto){
  //         const user = await this.userService.addClassroom(addClassroomDto);
  //         if(!user) throw new NotFoundException('Classroom not added');
  //         res.status(HttpStatus.OK).json({
  //             message:'success',
  //             user
  //         });
  //     }

  @Post('/login')
  async loginUser(@Res() res: Response, @Body() loginUserDto: LoginUserDto) {
    const user: Student | Teacher = await this.userService.loginUser(
      loginUserDto,
    );
    if (!user) throw new NotFoundException(['Usuario no encontrado']);
    res.status(HttpStatus.OK).json({
      message: 'success',
      user,
    });
  }

  @Post('/register/teacher')
  async registerTeacher(
    @Res() res: Response,
    @Body() registerTeacherDto: RegisterTeacherDto,
  ) {
    const user = await this.userService.registerTeacher(registerTeacherDto);
    if (!user) throw new NotFoundException(['Codigo usado o no existe']);
    res.status(HttpStatus.OK).json({
      message: 'success',
      user,
    });
  }

  @Post('/register/student')
  async registerStudent(
    @Res() res: Response,
    @Body() registerStudentDto: RegisterStudentDto,
  ) {
    if (registerStudentDto.email === registerStudentDto.parentEmail)
      throw new NotFoundException(['Los correos deben ser diferentes']);
    const user = await this.userService.registerStudent(registerStudentDto);
    if (!user) throw new NotFoundException(['Codigo usado o no existe']);
    res.status(HttpStatus.OK).json({
      message: 'success',
      user,
    });
  }

  @Post('/code/teacher')
  async addTeacherRegisterCode(
    @Res() res: Response,
    @Body() teacherRegisterCode: TeacherCodeDto,
  ) {
    const teacherCode = await this.userService.addTeacherRegisterCode(
      teacherRegisterCode,
    );
    if (!teacherCode) throw new NotFoundException('Error al agregar el código');
    res.status(HttpStatus.OK).json({
      message: 'success',
      teacherCode,
    });
  }

  @Post('/code/student')
  async addStudentRegisterCode(
    @Res() res: Response,
    @Body() studentRegisterCode: StudentCodeDto,
  ) {
    const teacherCode = await this.userService.addStudentRegisterCode(
      studentRegisterCode,
    );
    if (!teacherCode) throw new NotFoundException('Error al agregar el código');
    res.status(HttpStatus.OK).json({
      message: 'success',
      teacherCode,
    });
  }

  @Post('/school')
  async addSchool(@Res() res: Response, @Body() schoolDto: SchoolDto) {
    const school = await this.userService.addSchool(schoolDto);
    if (!school) throw new NotFoundException('Error al agregar colegio');
    res.status(HttpStatus.OK).json({
      message: 'success',
      school,
    });
  }

  @Get('/schools')
  async getSchools(@Res() res: Response) {
    const schools = await this.userService.getSchools();
    if (!schools) return new NotFoundException(['Error al obtener salones']);
    res.status(HttpStatus.OK).json({
      message: 'success',
      schools,
    });
  }

  @Post('/profile/:id')
  @UseInterceptors(
    FileInterceptor('profileImg', {
      storage: diskStorage({
        destination: './src/uploads/profileImages/',
        filename: (req, file, cb) => {
          cb(null, `${req.params.id}.png`);
        },
      }),
      fileFilter: imageFileFilter,
      limits: { files: 1, fileSize: 10000000 },
    }),
  )
  async setProfileImage(
    @Res() res: Response,
    @UploadedFile() file,
    @Param('id') userId: string,
  ) {
    const user = await this.userService.updateUserProfileImg(userId);
    if (!user) return new NotFoundException('Error al actualizar foto');
    res.status(HttpStatus.OK).json({
      message: 'success',
      profileImg: file.path,
    });
  }

  @Get('/profile/:id')
  getProfileImg(@Res() res: Response, @Param('id') profileId: string) {
    try {
      res.sendFile(
        join(process.cwd(), `/src/uploads/profileImages/${profileId}.png`),
        function(err) {
          res.status(HttpStatus.NOT_FOUND).end();
        },
      );
    } catch (error) {
      res.sendFile(null);
    }
  }

  @Post('/school/insigne/:id')
  @UseInterceptors(
    FileInterceptor('insigne', {
      storage: diskStorage({
        destination: './src/uploads/schoolInsignes/',
        filename: (req, file, cb) => {
          cb(null, `${req.params.id}.png`);
        },
      }),
      fileFilter: imageFileFilter,
      limits: { files: 1, fileSize: 10000000 },
    }),
  )
  async setSchoolInsigne(
    @Res() res: Response,
    @UploadedFile() file,
    @Param('id') schoolId: string,
  ) {
    const school = await this.userService.updateSchoolInsigne(schoolId);
    if (!school) return new NotFoundException('Error al actualiazar imagen');
    res.status(HttpStatus.OK).json({
      message: 'sucess',
      insigne: file.path,
    });
  }

  @Get('/school/insigne/:id')
  getSchoolInsigne(@Res() res: Response, @Param('id') schoolId: string) {
    try {
      res.sendFile(
        join(process.cwd(), `/src/uploads/schoolInsignes/${schoolId}.png`),
        function(err) {
          res.status(HttpStatus.NOT_FOUND).end();
        },
      );
    } catch (error) {
      res.sendFile(null);
    }
  }

  @Get('/:school')
  async getUsers(@Res() res: Response, @Param('school') schoolName: string) {
    const users = await this.userService.getUsers(schoolName);
    if (!users) return new NotFoundException(['Error al recoger usuarios']);
    res.status(HttpStatus.OK).json({
      message: 'success',
      users,
    });
  }

  @Post('/password')
  async changePassword(
    @Res() res: Response,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const newPassword = await this.userService.updateUserPassword(
      changePasswordDto,
    );
    if (!newPassword)
      throw new NotFoundException('Error al cambiar la contraseña');
    res.status(HttpStatus.OK).json({
      message: 'success',
    });
  }

  @Post('/change-school')
  async changeSchool(
    @Res() res: Response,
    @Body() changeSchoolDto: ChangeSchoolDto,
  ) {
    const newUser = await this.userService.changeSchool(changeSchoolDto);
    if (!newUser) throw new NotFoundException('Error al cambiar el colegio');
    res.status(HttpStatus.OK).json({
      message: 'success',
      user: newUser,
    });
  }

  @Delete('/id')
  async deteleUser(
    @Res() res: Response,
    @Body() changeSchoolDto: ChangeSchoolDto,
  ) {
    const newUser = await this.userService.changeSchool(changeSchoolDto);
    if (!newUser) throw new NotFoundException('Error al cambiar el colegio');
    res.status(HttpStatus.OK).json({
      message: 'success',
      user: newUser,
    });
  }

  @Get()
  async getConnectedUsers(@Res() res: Response) {
    const users = await this.userService.getConnectedUsers();
    if (!users)
      throw new NotFoundException('Error al traer usuarios conectados');
    res.status(HttpStatus.OK).json({
      users,
    });
  }

  @Get('/password/:email')
  async getPassword(@Res() res: Response, @Param('email') email: string) {
    const userPassword = await this.userService.getPassword(email);
    if (!userPassword)
      throw new NotFoundException('Error al recuperar contraseña');
    res.status(HttpStatus.OK).json({
      userPassword,
    });
  }
}
