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
import { AddEventDto } from './dto/add-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post('/new')
  async createEvent(@Res() res: Response, @Body() addEventDto: AddEventDto) {
    const event = await this.eventsService.createEvent(addEventDto);
    if (!event) throw new NotFoundException('Error al crear evento');
    res.status(HttpStatus.OK).json({
      message: 'success',
      event,
    });
  }

  @Get('/:id')
  async getEvents(@Res() res: Response, @Param('id') classroomId: string) {
    const events = await this.eventsService.getEvents(classroomId);
    if (!events) throw new NotFoundException('Error al crear evento');
    res.status(HttpStatus.OK).json({
      message: 'success',
      events,
    });
  }

  @Get('/birthdays/:id')
  async getBirthdays(@Res() res: Response, @Param('id') classroomId: string) {
    const events = await this.eventsService.getBirthdays(classroomId);
    if (!events) throw new NotFoundException('Error al crear evento');
    res.status(HttpStatus.OK).json({
      message: 'success',
      events,
    });
  }
}
