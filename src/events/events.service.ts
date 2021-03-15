import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import * as moment from 'moment';
import { AddEventDto } from './dto/add-event.dto';
import { EventTables } from './enums/tables.enum';
import { Event } from './models/event.interface';

@Injectable()
export class EventsService {
  private year = '2021';

  constructor(
    @InjectModel(EventTables.EVENT)
    private readonly eventModel: Model<Event>,
    private usersService: UsersService,
  ) {}

  async createEvent(addEventDto: AddEventDto) {
    try {
      const newEvent = await new this.eventModel(addEventDto).save();

      return newEvent;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getEvents(classroomId: string) {
    try {
      const events = await this.eventModel.find({ classroom: classroomId });
      return events;
    } catch (error) {
      return null;
    }
  }

  async getBirthdays(classroomId: string) {
    try {
      let events = [];
      const users = await this.usersService.getBirthdays(classroomId);
      users.forEach(user => {
        const unformatedBirthday = user.birthday.slice(0, -4);
        const start = moment(
          unformatedBirthday.concat(this.year),
          'MM-DD-YYYY',
        ).format('YYYY-MM-DD');

        events.push({
          start,
          title: `Cumpleaños de ${user.firstName} ${user.lastName}`,
        });
      });

      return events;
    } catch (error) {
      return null;
    }
  }
}
