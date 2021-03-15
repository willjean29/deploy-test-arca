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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, normalize } from 'src/utils';
import { join } from 'path';
import * as fs from 'fs';
import { MessagingService } from './messaging.service';

import { MessageDto } from './dto/message.dto';
import { MessagingGateway } from './messaging.gateway';

@Controller('messaging')
export class MessagingController {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly messagingGateway: MessagingGateway,
  ) {}

  @Post()
  async newMessage(@Res() res: Response, @Body() messageDto: MessageDto) {
    const message = await this.messagingService.newMessage(messageDto);
    if (!message) throw new NotFoundException('Error al enviar mensaje');
    this.messagingGateway.sendMessageToClient(message);
    res.status(HttpStatus.OK).json({
      message,
    });
  }

  @Post('/invitation/classroom')
  async classroomInvitation(
    @Res() res: Response,
    @Body() messageDto: MessageDto,
  ) {
    const message = await this.messagingService.newClassroomInvitation(
      messageDto,
    );
    if (!message) throw new NotFoundException('Error al enviar mensaje');
    this.messagingGateway.sendMessageToClient(message);
    res.status(HttpStatus.OK).json({
      message,
    });
  }

  @Get('/received/:userEmail')
  async getReceivedMessages(
    @Res() res: Response,
    @Param('userEmail') userEmail: string,
  ) {
    const messages = await this.messagingService.getReceivedMessages(userEmail);
    if (!messages) throw new NotFoundException('No hay mensajes');
    res.status(HttpStatus.OK).json({
      messages,
    });
  }

  @Post('/read/:id')
  async setMessageRead(@Res() res: Response, @Param('id') messageId: string) {
    const message = await this.messagingService.setMessageRead(messageId);
    if (!message)
      throw new NotFoundException('Error al cambiar a visto el mensaje');
    res.status(HttpStatus.OK).json({
      message,
    });
  }

  @Get('/sended/:userEmail')
  async getSendedMessages(
    @Res() res: Response,
    @Param('userEmail') userEmail: string,
  ) {
    const messages = await this.messagingService.getSendedMessages(userEmail);
    if (!messages) throw new NotFoundException('No hay mensajes');
    res.status(HttpStatus.OK).json({
      messages,
    });
  }

  @Get(':id')
  async getMessage(@Res() res: Response, @Param('id') messageId: string) {
    const message = await this.messagingService.getMessage(messageId);
    if (!message) throw new NotFoundException('No hay mensaje');
    res.status(HttpStatus.OK).json({
      message,
    });
  }

  @Delete('/:id')
  async deleteMessage(@Res() res: Response, @Param('id') userId: string) {
    const message = await this.messagingService.deleteMessage(userId);
    if (!message) throw new NotFoundException('No se borró el mensaje');
    res.status(HttpStatus.OK).json({
      message,
    });
  }

  @Post('/upload/:hour')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `./src/uploads/messagesFiles/`,
        filename: (req, file, cb) => {
          const { hour } = req.params;
          cb(
            null,
            hour.concat(normalize(file.originalname).replace(/\s+/g, '')),
          );
        },
      }),
      fileFilter: fileFilter,
      limits: { files: 1, fileSize: 10000000 },
      //10mb
    }),
  )
  async uploadMessageFile(@Res() res: Response, @UploadedFile() file) {
    res.status(HttpStatus.OK).json({
      message: 'success',
      file: normalize(file.originalname).replace(/\s+/g, ''),
    });
  }

  @Get('/download/:fileName')
  getClassroomFile(@Res() res: Response, @Param('fileName') fileName: string) {
    res.download(
      join(process.cwd(), `./src/uploads/messagesFiles/${normalize(fileName)}`),
    );
  }
}
