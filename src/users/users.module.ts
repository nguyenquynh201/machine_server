import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { OnesignalService } from 'src/onesignal/onesignal.service';
import { UserProductController } from './user-bank/user-product.controller';
import { UserProductService } from './user-bank/user-product.service';
import { USER_ADDRESS, USER_PRODUCT } from 'src/commons/constants/schemaConst';
import { UserProductSchema } from './user-bank/entities/user-product.entity';
import { UserAddressService } from './user-address/user-address.service';
import { UserAddressController } from './user-address/user-address.controller';
import { UserAddressSchema } from './user-address/entity/user-address.entity';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => UserSchema,
      },
      {
        name: USER_PRODUCT,
        useFactory: () => UserProductSchema,
      },
      {
        name: USER_ADDRESS,
        useFactory: () => UserAddressSchema,
      }
    ]),
    MailModule
  ],
  controllers: [UserProductController, UserAddressController, UsersController],
  providers: [UsersService, MailService, OnesignalService, UserProductService, UserAddressService],
  exports: [UsersService]
})
export class UsersModule { }
