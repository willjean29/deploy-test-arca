import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';

import { messageSchema } from './schema/message.schema';
import { MessagingGateway } from './messaging.gateway';
import { MessagingTables } from './enums';
import { studentSchema, teacherSchema } from 'src/users/schemas';

@Module({
  providers: [MessagingService, MessagingGateway],
  controllers: [MessagingController],
  imports: [
    MongooseModule.forFeature([
      { name: MessagingTables.MESSAGE, schema: messageSchema },
      { name: MessagingTables.TEACHER, schema: teacherSchema },
      { name: MessagingTables.STUDENT, schema: studentSchema },
    ]),
  ],
})
export class MessagingModule {}
