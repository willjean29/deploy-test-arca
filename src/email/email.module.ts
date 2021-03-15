import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { EmailService } from './email.service';

@Module({
  controllers: [],
  providers: [EmailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'mail.arcadepapel.net',
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'plataforma@arcadepapel.net',
          pass: 'plataformaarcaemail',
        },
      },
    }),
  ],
})
export class EmailModule {}
