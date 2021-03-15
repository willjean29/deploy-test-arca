import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { Topic } from './models/topic.interface';

@WebSocketGateway({ namespace: '/topics' })
export class TopicsGateway {
  @WebSocketServer() wss: Server;

  @SubscribeMessage('suscribeUserToTopic')
  handleJoinTopic(client: Socket, topicId: string) {
    client.join(topicId);

    //notificar ingreso al aula
  }
  @SubscribeMessage('leaveTopic')
  handleLeaveTopic(client: Socket, topicId: string) {
    client.leave(topicId);
    //notificar salida del aula
  }

  sendTopicToClient(topic: Topic) {
    this.wss.in(topic._id).emit('topicToClient', topic);
    // this.wss.to(classroom._id).emit('classroomToClient', classroom);
  }
}
