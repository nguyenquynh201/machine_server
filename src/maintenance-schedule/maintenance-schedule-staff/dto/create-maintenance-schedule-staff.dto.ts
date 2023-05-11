import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator";
import { MaintenanceScheduleEntity } from "src/maintenance-schedule/entity/maintenance-schedule.entity";

export class CreateMaintenanceScheduleStaffDto {
  /**
   * customer Id
   * @example 6130532100ca5f0097ead758
   */
  @IsMongoId()
  maintenanceSchedule: string | MaintenanceScheduleEntity;
  /**
   * staff Id
   * @example 6130532100ca5f0097ead751
   */
  @IsMongoId()
  staff: string;

  @IsString()
  @IsOptional()
  note?: string;
}

