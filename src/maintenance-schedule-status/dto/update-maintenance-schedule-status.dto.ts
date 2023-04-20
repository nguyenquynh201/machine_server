import { PartialType } from '@nestjs/swagger';
import { CreateMaintenanceScheduleStatusDto } from './create-maintenance-schedule-status.dto';
export class UpdateMaintenanceScheduleStatusDto extends PartialType(CreateMaintenanceScheduleStatusDto) { }
