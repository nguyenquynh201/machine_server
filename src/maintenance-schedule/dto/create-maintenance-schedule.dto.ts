import { IsNumber, IsOptional, IsString, IsMongoId, ValidateNested, IsDateString, IsEnum, IsArray } from "class-validator";
import { Type } from 'class-transformer';
import { MaintenanceScheduleTarget } from "../interface/maintenance-schedule-target";
import { MaintenanceStatusEnum } from "../interface/maintenance-schedule-status";

export class CreateMaintenanceScheduleDto {
  @IsString()
  maintenanceContent?: string;

  @IsMongoId()
  @IsOptional()
  products: string;

  @IsMongoId({ each: true })
  @IsOptional()
  errorMachine?: string[];

  /**
    * @example [waiting, cancel, coming, done]
    */
  @IsEnum(MaintenanceStatusEnum)
  @IsOptional()
  status: MaintenanceStatusEnum;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MaintenanceScheduleBug)
  bugs?: MaintenanceScheduleBug[];

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;
  /**
     * Default is `view`
     * @example [frequent, maintenance]
     */
  @IsEnum(MaintenanceScheduleTarget)
  @IsOptional()
  target: MaintenanceScheduleTarget;

  @IsMongoId({ each: true })
  @IsOptional()
  address: string;

  @IsString()
  note?: string;

}
class MaintenanceScheduleBug {
  @IsString()
  nameBug: string;

  @IsNumber()
  priceBug: number;
}

