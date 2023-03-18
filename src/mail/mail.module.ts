import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { SMTP_CONFIG } from 'src/commons/constants/envConstanst'; ``

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        secure: false,
        auth: {
          user: "nguyenquynhqb98@gmail.com",
          pass: "gmhmqlpkuvfeekqu"
        },
        port: 587,
      },
      defaults: {
        from: `"No reply" <noreply@gmail.com>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
