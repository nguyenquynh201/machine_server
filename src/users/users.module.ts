import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { OnesignalService } from 'src/onesignal/onesignal.service';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => UserSchema,
      }
    ]),
    MailModule
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService, OnesignalService],
  exports: [UsersService]
})
export class UsersModule { }
