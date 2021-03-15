import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { TopicsModule } from './topics/topics.module';
import { MessagingModule } from './messaging/messaging.module';
import { ExcercisesModule } from './excercises/excercises.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { EmailModule } from './email/email.module';
import { BooksModule } from './books/books.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EjerciciosModule } from './ejercicios/ejercicios.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://pixie:pixie123@cluster0.g8kd3.mongodb.net/arcavirtual', {
      useCreateIndex: true,
      useFindAndModify: false,
    }), //initializing db
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), './books'),
    }),
    UsersModule,
    ClassroomsModule,
    TopicsModule,
    MessagingModule,
    ExcercisesModule,
    EvaluationsModule,
    EmailModule,
    BooksModule,
    EjerciciosModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
