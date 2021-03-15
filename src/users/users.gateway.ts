import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Classroom } from 'src/classrooms/models';
import { ExamClassroom } from 'src/evaluations/models/exam-class.interface';
import { UserType } from './enums';
import { Student, Teacher } from './models';

@WebSocketGateway({ namespace: '/users' })
export class UsersGateway implements OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  private usersConnectedMap = new Map<string, string[]>();
  private usersConnectedIpMap = new Map<string, string>();

  @SubscribeMessage('userDisconnect')
  handleUserDisconnect(client: Socket, userId: string) {
    client.leave(userId);
    this.removeUserFromMap(client.id);
    const users = [...this.usersConnectedMap.keys()];
    console.log(this.usersConnectedIpMap);
    console.log(this.usersConnectedMap);
    this.showTotalConnectedUsers();
    this.wss.emit('connectedUsersFromServer', users);
  }

  handleDisconnect(client: Socket) {
    this.removeUserFromMap(client.id);
    const users = [...this.usersConnectedMap.keys()];

    console.log(this.usersConnectedIpMap);
    console.log(this.usersConnectedMap);
    this.showTotalConnectedUsers();
    this.wss.emit('connectedUsersFromServer', users);
  }

  @SubscribeMessage('userLogin')
  handleUserLogin(
    client: Socket,
    loginDto: { userId: string; userIp: string },
  ) {
    client.join(loginDto.userId);
    this.addUserToMap(loginDto.userIp, client.id, loginDto.userId);
    const users = [...this.usersConnectedMap.keys()];
    console.log(this.usersConnectedIpMap);
    console.log(this.usersConnectedMap);
    this.showTotalConnectedUsers();
    this.wss.emit('connectedUsersFromServer', users);
  }

  sendChangesToUser(user: Teacher | Student) {
    if (user.type === UserType.TEACHER) {
      this.sendChangesToTeacher(user);
    }
    if (user.type === UserType.STUDENT) {
      this.sendChangesToStudent(user);
    }
  }
  sendChangesToTeacher(user: Teacher) {
    this.wss.to(user._id).emit('teacherToClient', user);
  }
  sendChangesToStudent(user: Student) {
    this.wss.to(user._id).emit('studentToClient', user);
  }

  sendClassroomToStudent(classroom: Classroom, studentId: string) {
    this.wss.to(studentId).emit('classroomToStudent', classroom);
  }

  sendClock(clock: string) {
    this.wss.emit('clockFromServer', clock);
  }

  sendExamNotificationStart(examClassroom: ExamClassroom, userId: string) {
    this.wss.to(userId).emit('examClassroomStart', examClassroom);
  }

  sendExamNotificationFinish(examClassroom: ExamClassroom, userId: string) {
    this.wss.to(userId).emit('examClassroomFinish', examClassroom);
  }

  addUserToMap(clientIp: string, socketId: string, userId: string) {
    if (
      this.usersConnectedIpMap.has(userId) &&
      this.usersConnectedIpMap.get(userId) !== clientIp
    ) {
      this.wss.to(userId).emit('userAlreadyConnected');
      this.usersConnectedIpMap.delete(userId);
      this.usersConnectedMap.delete(userId);
    } else {
      this.usersConnectedIpMap.set(userId, clientIp);
      if (this.usersConnectedMap.has(userId)) {
        this.usersConnectedMap.set(userId, [
          ...this.usersConnectedMap.get(userId),
          socketId,
        ]);
      } else {
        this.usersConnectedMap.set(userId, [socketId]);
      }
    }
  }

  removeUserFromMap(socketId: string) {
    if (this.getByValue(socketId)) {
      const userId = this.getByValue(socketId);
      const oldSockets = this.usersConnectedMap.get(userId);
      const newSockets = oldSockets.filter(socket => socket !== socketId);
      if (newSockets.length === 0) {
        this.usersConnectedIpMap.delete(userId);
        this.usersConnectedMap.delete(userId);
      } else {
        this.usersConnectedMap.set(userId, newSockets);
      }
    }
  }

  getByValue(searchValue: string) {
    for (let [key, value] of this.usersConnectedMap.entries()) {
      if (value.indexOf(searchValue) !== -1) return key;
    }
  }

  getConnectedUsers() {
    return [...this.usersConnectedMap.keys()];
  }

  showTotalConnectedUsers() {
    let total = 0;
    this.usersConnectedMap.forEach((value: string[]) => {
      total = total + value.length;
    });
    console.log(total);
  }

  sendDeletedClassroomToClient(classroomId: string) {
    this.wss.emit('deletedClassroomFromServer', classroomId);
  }
}
