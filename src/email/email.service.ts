import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MessageDto } from 'src/messaging/dto/message.dto';
@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailEvaluation(receptor: string, message: MessageDto) {
    try {
      const greeting =
        '<p>Un cordial saludo padre de familia, mediante este correo se le informa que su menor hij@ </p> ';
      const res = await this.mailerService.sendMail({
        from: 'plataforma@arcavirtual.net',
        to: receptor,
        subject: 'NUEVA EVALUACIÓN',
        html: greeting.concat(message.messageText),
      });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async sendEmailPassword(receptor: string, message: string) {
    try {
      const greeting =
        '<p>Estimado usuario por este medio le enviamos su contraseña:  </p> ';
      const res = await this.mailerService.sendMail({
        from: 'plataforma@arcavirtual.net',
        to: receptor,
        subject: 'RECUPERAR CONTRASEÑA',
        html: greeting.concat(message),
      });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
