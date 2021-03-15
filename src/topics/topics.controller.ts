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
} from '@nestjs/common';
import { Response } from 'express';

import { TopicsService } from './topics.service';

//interfaces
import { Topic } from './models/topic.interface';

//DTOs
import { TopicDto } from './dto/topic.dto';
import { ClassroomsGateway } from 'src/classrooms/classrooms.gateway';
import { TopicCommentDto } from './dto/topic-comment.dto';
import { TopicsGateway } from './topics.gateway';

@Controller('topics')
export class TopicsController {
  constructor(
    private topicsService: TopicsService,
    private classroomsGateway: ClassroomsGateway,
    private topicsGateway: TopicsGateway,
  ) {}
  @Post('/create')
  async createTopic(@Res() res: Response, @Body() topicDto: TopicDto) {
    const { topic, classroom } = await this.topicsService.createTopic(topicDto);
    if (!topic) throw new Error('Topic was not created');
    this.classroomsGateway.sendClassroomToClient(classroom);
    res.status(HttpStatus.OK).json({
      success: true,
      topic,
    });
  }

  @Get('/:id')
  async getTopic(@Res() res: Response, @Param('id') topicId: string) {
    const topic: Topic = await this.topicsService.getTopic(topicId);
    if (!topic) throw new NotFoundException('Topic does not exist');
    res.status(HttpStatus.OK).json({
      success: true,
      topic,
    });
  }

  @Post(':id')
  async getTopics(@Res() res: Response, @Param('id') classroomId: string) {
    const topics: Topic[] = await this.topicsService.getTopics(classroomId);
    if (!topics) throw new Error('Topics were not delivered');
    res.status(HttpStatus.OK).json({
      message: 'success',
      topics,
    });
  }

  @Put('/update/:id')
  async updateTopic(
    @Res() res: Response,
    @Body() topicDto: TopicDto,
    @Param('id') topicId: string,
  ) {
    const topic = await this.topicsService.updateTopic(topicId, topicDto);
    if (!topic) throw new Error('Topic was not updated');
    res.status(HttpStatus.OK).json({
      success: true,
      topic,
    });
  }

  @Delete('/:id')
  async deleteTopic(@Res() res: Response, @Param('id') topicId: string) {
    const topic = await this.topicsService.deleteTopic(topicId);
    if (!topic) throw new Error('Topic was not deleted');
    this.classroomsGateway.sendDeletedTopic(topic);
    res.status(HttpStatus.OK).json({
      success: true,
      topic,
    });
  }

  @Post('/addcomment/:id')
  async addTopicComment(
    @Res() res: Response,
    @Param('id') topicId: string,
    @Body() topicComment: TopicCommentDto,
  ) {
    const topic: Topic = await this.topicsService.addTopicComment(
      topicId,
      topicComment,
    );
    console.log(TopicCommentDto);
    if (!topic) throw new NotFoundException('Comment was not added');
    res.status(HttpStatus.OK).json({
      success: true,
      topic,
    });
    this.topicsGateway.sendTopicToClient(topic); //notificar cambio a los que estan escuchando el id
  }

  @Post('/removecomment/:id')
  async removeTopicComment(
    @Res() res: Response,
    @Param('id') topicId: string,
    @Body() topicComment: TopicCommentDto,
  ) {
    const topic: Topic = await this.topicsService.removeTopicComment(
      topicId,
      topicComment,
    );
    if (!topic) throw new NotFoundException('Comment was not added');
    res.status(HttpStatus.OK).json({
      success: true,
      topic,
    });
    this.topicsGateway.sendTopicToClient(topic); //notificar cambio a los que estan escuchando el id
  }
}
