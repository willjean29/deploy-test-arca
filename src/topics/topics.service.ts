import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

//interfaces
import { Topic } from './models/topic.interface';

//DTOs
import { TopicDto } from './dto/topic.dto';
import { TopicTables, Field } from './enum';
import { Classroom } from 'src/classrooms/models';
import { TopicCommentDto } from './dto/topic-comment.dto';
import { TopicComment } from './models/topic-comment.interface';
import { ClassroomsGateway } from 'src/classrooms/classrooms.gateway';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(TopicTables.TOPIC) private readonly topicModel: Model<Topic>,
    @InjectModel(TopicTables.TOPIC_COMMENT)
    private readonly topicCommentModel: Model<TopicComment>,
    @InjectModel(TopicTables.CLASSROOM)
    private readonly classroomModel: Model<Classroom>,
    private classroomsGateway: ClassroomsGateway,
  ) {}

  async createTopic(topicDto: TopicDto) {
    const topic: Topic = await new this.topicModel(topicDto).save();
    const classroom = await this.classroomModel
      .findByIdAndUpdate(
        topic.classroom,
        { $addToSet: { topics: topic._id } },
        { new: true },
      )
      .populate(Field.TEACHER, {}, TopicTables.TEACHER)
      .populate(Field.STUDENTS, {}, TopicTables.STUDENT)
      .populate(Field.SCHOOL, {}, TopicTables.SCHOOL)
      .populate(Field.TOPICS, {}, TopicTables.TOPIC);

    return { topic, classroom };
  }
  async getTopic(topicId: string): Promise<Topic> {
    const topic: Topic = await this.topicModel
      .findById(topicId)
      .populate(Field.CLASSROOM, {}, TopicTables.CLASSROOM);
    return topic;
  }

  async updateTopic(topicId: string, topicDto: TopicDto): Promise<Topic> {
    const updatedTopic: Topic = await this.topicModel
      .findByIdAndUpdate(topicId, topicDto, { new: true })
      .populate(Field.CLASSROOM, {}, TopicTables.CLASSROOM);
    return updatedTopic;
  }

  async deleteTopic(topicId: string): Promise<Topic> {
    const deletedTopic: Topic = await this.topicModel.findByIdAndDelete(
      topicId,
    );
    // this.classroomsGateway.sendClassroomToClient();
    return deletedTopic;
  }

  async getTopics(classroomId: string): Promise<Topic[]> {
    const topics: Topic[] = await this.topicModel.find({
      classroom: classroomId,
    });
    return topics;
  }
  async addTopicComment(topicId: string, topicCommentDto: TopicCommentDto) {
    try {
      const comment = new this.topicCommentModel(topicCommentDto);
      //retornar usuario

      const topic: Topic = await this.topicModel
        .findByIdAndUpdate(
          topicId,
          { $push: { comments: comment } },
          { new: true },
        )
        .populate(Field.TEACHER, {}, TopicTables.TEACHER)
        .populate(Field.STUDENTS, {}, TopicTables.STUDENT)
        .populate(Field.SCHOOL, {}, TopicTables.SCHOOL)
        .populate(Field.TOPICS, {}, TopicTables.TOPIC);

      return topic;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async removeTopicComment(topicId: string, topicCommentDto: TopicCommentDto) {
    try {
      const comment = new this.topicCommentModel(topicCommentDto);
      //retornar usuario

      const topic: Topic = await this.topicModel
        .findByIdAndUpdate(
          topicId,
          { $pull: { comments: comment } },
          { new: true },
        )
        .populate(Field.TEACHER, {}, TopicTables.TEACHER)
        .populate(Field.STUDENTS, {}, TopicTables.STUDENT)
        .populate(Field.SCHOOL, {}, TopicTables.SCHOOL)
        .populate(Field.TOPICS, {}, TopicTables.TOPIC);

      return topic;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteTopicsByClassroom(classroomId: string) {
    try {
      const deletedTopics = await this.topicModel.deleteMany({
        classroom: classroomId,
      });
      return deletedTopics;
    } catch (error) {
      return null;
    }
  }
}
