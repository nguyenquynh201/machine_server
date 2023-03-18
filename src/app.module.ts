import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { connectUrl, connectOptions } from './configs/mongo.cnf'
import { ProductCtgModule } from './product-ctg/product-ctg.module';
import { ProductsModule } from './products/products.module';

import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './commons/filters/exceptionFilter';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { OnesignalService } from './onesignal/onesignal.service';
import { OnesignalController } from './onesignal/onesignal.controller';
import { OnesignalModule } from './onesignal/onesignal.module';

@Module({
  imports: [
    MongooseModule.forRoot(connectUrl, connectOptions),
    AuthModule,
    UsersModule,
    ProductCtgModule,
    ProductsModule,
    OnesignalModule,
  ],
  controllers: [AppController, OnesignalController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    OnesignalService,
  ],
})
export class AppModule { }
