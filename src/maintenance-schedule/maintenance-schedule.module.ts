import { Module } from '@nestjs/common';
import { MaintenanceScheduleController } from './maintenance-schedule.controller';
import { MaintenanceScheduleService } from './maintenance-schedule.service';
import { HistoryModule } from './history/history.module';
import { ERROR_MACHINE, MAINTENANCE_SCHEDULE, MAINTENANCE_SCHEDULE_HISTORY, MAINTENANCE_SCHEDULE_RATE, MAINTENANCE_SCHEDULE_STAFF, PRODUCT } from 'src/commons/constants/schemaConst';
import { MaintenanceScheduleEntitySchema } from './entity/maintenance-schedule.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { ProductsController } from 'src/products/products.controller';
import { ErrorMachineService } from 'src/error-machine/error-machine.service';
import { ErrorMachineController } from 'src/error-machine/error-machine.controller';
import { ErrorMachineEntitySchema } from 'src/error-machine/entity/error-machine.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { MaintenanceScheduleStaffService } from './maintenance-schedule-staff/maintenance-schedule-staff.service';
import { MaintenanceScheduleStaffSchema } from './entity/maintenance-schedule-staff.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { UserAddress, UserAddressSchema } from 'src/users/user-address/entity/user-address.entity';
import { MaintenanceScheduleHistoryController } from './maintenance-schedule-history/maintenance-schedule-history.controller';
import { MaintenanceScheduleHistoryService } from './maintenance-schedule-history/maintenance-schedule-history.service';
import { TenantPlugin } from 'src/commons/mongoosePlugins/tenant.plugin';
import { MaintenanceScheduleRateService } from './maintenance-schedule-rate/maintenance-schedule-rate.service';
import { MaintenanceScheduleRateController } from './maintenance-schedule-rate/maintenance-schedule-rate.controller';
import { MaintenanceScheduleRateEntitySchema } from './maintenance-schedule-rate/entity/maintenance-schedule-rate.entity';
import { MaintenanceScheduleHistorySchema } from './entity/maintenance-schedule-history.entity';


@Module({
  imports: [
    HistoryModule,
    NotificationsModule,
    MongooseModule.forFeatureAsync([
      { name: MAINTENANCE_SCHEDULE, useFactory: () => MaintenanceScheduleEntitySchema },
      { name: PRODUCT, useFactory: () => ProductSchema },
      { name: ERROR_MACHINE, useFactory: () => ErrorMachineEntitySchema },
      { name: MAINTENANCE_SCHEDULE_STAFF, useFactory: () => MaintenanceScheduleStaffSchema },
      { name: User.name, useFactory: () => UserSchema },
      { name: UserAddress.name, useFactory: () => UserAddressSchema },
      {
        name: MAINTENANCE_SCHEDULE_HISTORY, useFactory: () => {
          return MaintenanceScheduleHistorySchema.plugin(TenantPlugin.addPlugin);
        }
      },
      { name: MAINTENANCE_SCHEDULE_RATE, useFactory: () => MaintenanceScheduleRateEntitySchema },
    ])],
  controllers: [MaintenanceScheduleController, ProductsController, ErrorMachineController, MaintenanceScheduleHistoryController, MaintenanceScheduleRateController],
  providers: [MaintenanceScheduleService, ProductsService, ErrorMachineService, MaintenanceScheduleStaffService, MaintenanceScheduleHistoryService, MaintenanceScheduleRateService],
})
export class MaintenanceScheduleModule { }
