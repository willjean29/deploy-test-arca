import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

import { topicSchema } from './schemas/topic.schema';
import { TopicTables } from './enum';
import { classroomSchema } from 'src/classrooms/schemas';
import { ClassroomsGateway } from 'src/classrooms/classrooms.gateway';
import { TopicsGateway } from './topics.gateway';
import { topicCommentSchema } from './schemas/topic-comment.schema';

@Module({
  controllers: [TopicsController],
  providers: [TopicsService, ClassroomsGateway, TopicsGateway],
  imports: [
    MongooseModule.forFeature([
      { name: TopicTables.TOPIC, schema: topicSchema },
      { name: TopicTables.CLASSROOM, schema: classroomSchema },
      { name: TopicTables.TOPIC_COMMENT, schema: topicCommentSchema },
    ]),
  ],
  exports: [TopicsService],
})
export class TopicsModule {}
