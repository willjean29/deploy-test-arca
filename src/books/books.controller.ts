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
import { join } from 'path';
import { UsersGateway } from 'src/users/users.gateway';
import { BooksService } from './books.service';
import { AddBookDto } from './dto/add-book.dto';
import { BookCodeDto } from './dto/book-code.dto';
import { BookDto } from './dto/book.dto';
import { GetBookDto } from './dto/get-book.dto';
import { Book } from './models/book.interface';

@Controller('books')
export class BooksController {
  constructor(
    private booksService: BooksService,
    private usersGateway: UsersGateway,
  ) {}

  @Post('/create')
  async createBook(@Res() res: Response, @Body() bookDto: BookDto) {
    const book = await this.booksService.createBook(bookDto);
    if (!book) throw new NotFoundException('Error al crear libro');
    res.status(HttpStatus.OK).json({
      success: true,
      book,
    });
  }

  @Post('/create/bookCode')
  async createBookCode(@Res() res: Response, @Body() bookCodeDto: BookCodeDto) {
    const bookCode = await this.booksService.createBookCode(bookCodeDto);
    if (!bookCode)
      throw new NotFoundException('Error al crear codigo de libro');
    res.status(HttpStatus.OK).json({
      success: true,
      book: bookCode,
    });
  }

  @Post('/serve')
  async getBook(@Res() res: Response, @Body() getBookDto: GetBookDto) {
    const book = await this.booksService.getBook(
      getBookDto.code,
      getBookDto.user,
    );
    if (!book) throw new NotFoundException('Error al obtener libro');
    if (this.usersGateway.getConnectedUsers().indexOf(getBookDto.user) === -1)
      throw new NotFoundException('Usuario no conectado');
    res.sendFile(
      join(process.cwd(), `./books${(book.book as Book).image}/index.html`),
    );
  }

  @Get('/library/:id')
  async getLibrary(@Res() res: Response, @Param('id') userId: string) {
    const books = await this.booksService.getLibrary(userId);
    if (!books) throw new NotFoundException('Error al crear libro');
    res.status(HttpStatus.OK).json({
      success: true,
      books,
    });
  }

  @Post('/library/add')
  async addBookToLibrary(@Res() res: Response, @Body() addBookDto: AddBookDto) {
    const book = await this.booksService.addBookToLibrary(addBookDto);
    if (!book) throw new NotFoundException('Error al agregar libro');
    res.status(HttpStatus.OK).json({
      success: true,
      book,
    });
  }

  @Delete('/delete/:id')
  async deleteBook(@Res() res: Response, @Param('id') bookCodeId: string) {
    const deletedBook = await this.booksService.deleteBookCode(bookCodeId);
    if (!deletedBook) throw new NotFoundException('Error al eliminar libro');
    res.status(HttpStatus.OK).json({
      success: true,
      deletedBook,
    });
  }

  @Get('/:level/:name')
  getProfileImg(
    @Res() res: Response,
    @Param('level') level: string,
    @Param('name') bookName: string,
  ) {
    try {
      res.sendFile(
        join(process.cwd(), `/src/uploads/books/${level}/${bookName}.jpg`),
        function(err) {
          res.status(HttpStatus.NOT_FOUND).end();
        },
      );
    } catch (error) {
      res.sendFile(null);
    }
  }
}
