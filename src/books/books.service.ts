import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddBookDto } from './dto/add-book.dto';
import { BookCodeDto } from './dto/book-code.dto';
import { BookDto } from './dto/book.dto';
import { BookTables, Field } from './enums/tables.enum';
import { BookCode } from './models/book-code.interface';
import { Book } from './models/book.interface';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(BookTables.BOOK)
    private readonly bookModel: Model<Book>,
    @InjectModel(BookTables.BOOK_CODE)
    private readonly bookCodeModel: Model<BookCode>,
  ) {}

  async createBook(bookDto: BookDto) {
    try {
      const newBook = await new this.bookModel(bookDto).save();

      return newBook;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createBookCode(bookCodeDto: BookCodeDto) {
    try {
      const newBookCode = await new this.bookCodeModel(bookCodeDto).save();

      return newBookCode;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getLibrary(userId: string) {
    try {
      const books = await this.bookCodeModel
        .find({ user: userId })
        .populate(Field.BOOK, {}, BookTables.BOOK);
      return books;
    } catch (error) {
      return null;
    }
  }

  async addBookToLibrary(addBookDto: AddBookDto) {
    try {
      const usedCode = await this.bookCodeModel.findOne({
        code: addBookDto.code,
      });
      if (usedCode.user) return null;
      const book = await this.bookCodeModel
        .findOneAndUpdate(
          { code: addBookDto.code },
          { user: addBookDto.user },
          { new: true },
        )
        .populate(Field.BOOK, {}, BookTables.BOOK);
      return book;
    } catch (error) {
      return null;
    }
  }

  async getBook(bookCode: string, user: string) {
    try {
      const book = await this.bookCodeModel
        .findOne({ code: bookCode, user })
        .populate(Field.BOOK, {}, BookTables.BOOK);
      return book;
    } catch (error) {
      return null;
    }
  }

  async deleteBookCode(bookCodeId: string) {
    try {
      const deletedBook = await this.bookCodeModel.findByIdAndUpdate(
        bookCodeId,
        { user: '666666666666666666666666' },
        { new: true },
      );
      return deletedBook;
    } catch (error) {
      return null;
    }
  }
}
