import { IsMongoId, IsEnum } from "class-validator";
import { MaintenanceStatusEnum } from "../interface/maintenance-schedule-status";

export class UpdateStatus {

    @IsEnum(MaintenanceStatusEnum)
    status: MaintenanceStatusEnum;
}