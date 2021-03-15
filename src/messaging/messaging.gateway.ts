import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({ namespace: '/messaging' })
export class MessagingGateway {
  @WebSocketServer() wss: Server;

  @SubscribeMessage('suscribeUserToMessages')
  suscribeUserToMessages(client: Socket, userEmail: string) {
    if (client.rooms[userEmail]) return;
    client.join(userEmail);
  }

  sendMessageToClient(message: MessageDto) {
    this.wss.to(message.receptor).emit('messageToClient', message);
  }

  sendMessageEvaluationToClient(message: MessageDto) {
    this.wss.to(message.receptor).emit('messageEvaluationToClient', message);
  }
}
