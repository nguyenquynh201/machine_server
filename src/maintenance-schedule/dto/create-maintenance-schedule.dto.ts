import { IsNumber, IsOptional, IsString, IsMongoId, ValidateNested, IsDateString, IsEnum } from "class-validator";
import { Type } from 'class-transformer';
import { MaintenanceScheduleTarget } from "../interface/maintenance-schedule-target";

export class CreateMaintenanceScheduleDto {
    @IsString()
    maintenanceContent?: string;

    @IsMongoId()
    @IsOptional()
    products: string;

    @IsMongoId({ each: true })
    @IsOptional()
    errorMachine?: string[];

    @IsMongoId()
    @IsOptional()
    status?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => MaintenanceScheduleBug)
    bug?: MaintenanceScheduleBug[];

    @IsDateString()
    @IsOptional()
    startDate?: Date;

    @IsEnum(MaintenanceScheduleTarget)
    @IsOptional()
    target: MaintenanceScheduleTarget;

    @IsString()
    note?: string;

}
class MaintenanceScheduleBug {
    @IsString()
    nameBug: string;

    @IsNumber()
    priceBug: number;
}

