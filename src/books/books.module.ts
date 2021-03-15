import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookTables } from './enums/tables.enum';
import { bookCodeSchema } from './schemas/book-code.schema';
import { bookSchema } from './schemas/book.schema';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [
    MongooseModule.forFeature([
      {
        name: BookTables.BOOK,
        schema: bookSchema,
      },
      { name: BookTables.BOOK_CODE, schema: bookCodeSchema },
    ]),
    UsersModule,
  ],
})
export class BooksModule {}
