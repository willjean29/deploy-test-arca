import { MessageDto } from './dto/message.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './models/message.interface';
import { MessagingTables } from './enums';
import { Student, Teacher } from 'src/users/models';

@Injectable()
export class MessagingService {
  constructor(
    @InjectModel(MessagingTables.MESSAGE)
    private readonly messageModel: Model<Message>,
    @InjectModel(MessagingTables.TEACHER)
    private readonly teacherModel: Model<Teacher>,
    @InjectModel(MessagingTables.STUDENT)
    private readonly studentModel: Model<Student>,
  ) {}

  async newMessage(messageDto: MessageDto): Promise<Message> {
    try {
      const message: Message = new this.messageModel(messageDto);
      return await message.save();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async newClassroomInvitation(messageDto: MessageDto): Promise<Message> {
    try {
      const student = await this.studentModel.findOne({
        email: messageDto.receptor,
      });
      if (!student) return null;

      const messageText = messageDto.messageText.replace('CAMBIO', student._id);

      const editedDto: MessageDto = {
        ...messageDto,
        messageText,
      };
      const message: Message = new this.messageModel(editedDto);
      return await message.save();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getMessage(messageId: string) {
    try {
      const message = await this.messageModel.findById(messageId);
      return message;
    } catch (error) {}
  }
  async getReceivedMessages(userEmail: string): Promise<Message[]> {
    try {
      const messages: Message[] = await this.messageModel.find({
        receptor: userEmail,
      });
      return messages;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getSendedMessages(userEmail: string): Promise<Message[]> {
    try {
      const messages: Message[] = await this.messageModel.find({
        sender: userEmail,
      });
      return messages;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async deleteMessage(messageId: string): Promise<Message> {
    try {
      const message: Message = await this.messageModel.findByIdAndDelete(
        messageId,
      );
      return message;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async setMessageRead(messageId: string) {
    try {
      const message = await this.messageModel.findByIdAndUpdate(
        messageId,
        { read: true },
        { new: true },
      );
      return message;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
