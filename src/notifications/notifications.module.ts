import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Notifications, NotificationsSchema } from './entities/notification.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { FcmService } from './firebase/fcm.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Notifications.name, useFactory: () => NotificationsSchema },
    ]),
    UsersModule,
  ],
  controllers: [NotificationsController,],
  providers: [NotificationsService, FcmService],
  exports: [NotificationsService, FcmService],
})

export class NotificationsModule { }
