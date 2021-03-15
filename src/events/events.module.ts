import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventsGateway } from './events.gateway';
import { EventTables } from './enums/tables.enum';
import { eventSchema } from './schemas/event.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';

@Module({
  providers: [EventsService, EventsGateway],
  controllers: [EventsController],
  imports: [
    MongooseModule.forFeature([
      {
        name: EventTables.EVENT,
        schema: eventSchema,
      },
    ]),
    UsersModule,
    ClassroomsModule,
  ],
})
export class EventsModule {}
