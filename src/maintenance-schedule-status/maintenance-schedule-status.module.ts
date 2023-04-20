import { Module } from '@nestjs/common';
import { MaintenanceScheduleStatusController } from './maintenance-schedule-status.controller';
import { MaintenanceScheduleStatusService } from './maintenance-schedule-status.service';
import { MaintenanceScheduleSchema } from 'src/maintenance-schedule-status/entity/maintenance-schedule-status.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MAINTENANCE_SCHEDULE_STATUS } from 'src/commons/constants/schemaConst';
@Module({
  imports: [MongooseModule.forFeature([{ name: MAINTENANCE_SCHEDULE_STATUS, schema: MaintenanceScheduleSchema }])],

  controllers: [MaintenanceScheduleStatusController],
  providers: [MaintenanceScheduleStatusService]
})
export class MaintenanceScheduleStatusModule { }
