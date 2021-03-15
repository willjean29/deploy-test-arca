import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { ExamClassroom } from 'src/evaluations/models/exam-class.interface';
import { Exam } from 'src/evaluations/models/exam.interface';
import { Topic } from 'src/topics/models/topic.interface';

import { Classroom } from './models';
import { BannedStudent } from './models/banned-student.interface';
@WebSocketGateway({ namespace: '/classrooms', transports: ['websocket'] })
export class ClassroomsGateway {
  @WebSocketServer() wss: Server;
  private usersConnected = new Map<string, string[]>();

  @SubscribeMessage('suscribeUserToClassroom')
  handleJoinClassroom(client: Socket, { classroomId, userId }) {
    client.join(classroomId);
    const users = this.addUserConnected(classroomId, userId);
    // console.log(this.usersConnected);
    this.wss
      .in(classroomId)
      .emit('connectedUsersClassroom', users.get(classroomId));
  }
  @SubscribeMessage('leaveUserFromClassroom')
  handleLeaveClassroom(client: Socket, { classroomId, userId }) {
    client.leave(classroomId);
    const users = this.removeUserConnected(classroomId, userId);
    // console.log(this.usersConnected);
    this.wss
      .in(classroomId)
      .emit('connectedUsersClassroom', users.get(classroomId));
  }

  sendClassroomToClient(classroom: Classroom) {
    this.wss.in(classroom._id).emit('classroomToClient', classroom);
  }

  sendUsersConnected(classroomId: string) {
    console.log(this.wss.of(classroomId).sockets);
    this.wss.in(classroomId).emit('usersConnected');
  }

  addUserConnected(classroomId: string, userId: string) {
    if (this.usersConnected.has(classroomId)) {
      const users = this.usersConnected.get(classroomId);
      if (users.indexOf(userId) !== -1) {
        return this.usersConnected;
      }
      this.usersConnected.set(classroomId, [...users, userId]);
      return this.usersConnected;
    } else {
      this.usersConnected.set(classroomId, [userId]);
      return this.usersConnected;
    }
  }

  removeUserConnected(classroomId: string, userId: string) {
    if (this.usersConnected.has(classroomId)) {
      const users = this.usersConnected.get(classroomId);
      const newUsers = users.filter(user => user !== userId);
      this.usersConnected.set(classroomId, newUsers);
      return this.usersConnected;
    }
  }

  sendTopicsToClient(topics: Topic[], classroomId: string) {
    this.wss.in(classroomId).emit('newTopicsToClient', topics);
    //poner en topic controller
  }

  sendBannedUsersToClient(bannedStudent: BannedStudent) {
    this.wss
      .in(bannedStudent.classroom)
      .emit('bannedStudentToClient', bannedStudent);
  }

  sendExamClassroomDeleted(examClassroom: ExamClassroom) {
    this.wss
      .in(examClassroom.classroom as string)
      .emit('examClassroomDeletedToClient', examClassroom._id);
  }
  sendDeletedTopic(topic: Topic) {
    this.wss
      .in(topic.classroom as string)
      .emit('deletedTopicFromServer', topic._id);
  }
}
