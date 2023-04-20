import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateMaintenanceScheduleStatusDto {
    @IsString()
    name: string;
    @IsString()
    @IsOptional()
    description?: string;
    @IsString()
    @IsOptional()
    color?: string;
    @IsBoolean()
    @IsOptional()
    inactiveMaintenanceSchedule?: boolean
}
