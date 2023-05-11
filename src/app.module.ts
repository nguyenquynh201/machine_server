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
import { MaintenanceScheduleModule } from './maintenance-schedule/maintenance-schedule.module';
import { MaintenanceScheduleStatusModule } from './maintenance-schedule-status/maintenance-schedule-status.module';
import { ErrorMachineModule } from './error-machine/error-machine.module';
import { BugsModule } from './bugs/bugs.module';
import { BannerModule } from './banner/banner.module';
import { ProvincesController } from './provinces/provinces.controller';
// import { ProvincesService } from './provinces/provinces.service';
import { ProvincesModule } from './provinces/provinces.module';
// import { LoggerModule } from './loggers/logger.module';
// import { MaintenanceScheduleStaffService } from './maintenance_schedule/maintenance_schedule_staff/maintenance_schedule_staff.service';

@Module({
  imports: [
    MongooseModule.forRoot(connectUrl, connectOptions),
    AuthModule,
    UsersModule,
    ProductCtgModule,
    ProductsModule,
    OnesignalModule,
    MaintenanceScheduleModule,
    MaintenanceScheduleStatusModule,
    ErrorMachineModule,
    BugsModule,
    BannerModule,
    ProvincesModule,
    // LoggerModule
  ],
  controllers: [AppController, OnesignalController, ProvincesController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    OnesignalService,
  
    // MaintenanceScheduleStaffService,
    // ProvincesService,
  ],
})
export class AppModule { }
