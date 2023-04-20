import { Module } from '@nestjs/common';
import { MaintenanceScheduleController } from './maintenance-schedule.controller';
import { MaintenanceScheduleService } from './maintenance-schedule.service';
import { HistoryModule } from './history/history.module';
import { ERROR_MACHINE, MAINTENANCE_SCHEDULE, PRODUCT } from 'src/commons/constants/schemaConst';
import { MaintenanceScheduleEntitySchema } from './entity/maintenance-schedule.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { ProductsController } from 'src/products/products.controller';
import { ErrorMachineService } from 'src/error-machine/error-machine.service';
import { ErrorMachineController } from 'src/error-machine/error-machine.controller';
import { ErrorMachineEntitySchema } from 'src/error-machine/entity/error-machine.entity';


@Module({
  controllers: [MaintenanceScheduleController, ProductsController, ErrorMachineController],
  providers: [MaintenanceScheduleService, ProductsService, ErrorMachineService],
  imports: [HistoryModule, MongooseModule.forFeature([{ name: MAINTENANCE_SCHEDULE, schema: MaintenanceScheduleEntitySchema }, { name: PRODUCT, schema: ProductSchema }, { name: ERROR_MACHINE, schema: ErrorMachineEntitySchema }])]
})
export class MaintenanceScheduleModule { }
