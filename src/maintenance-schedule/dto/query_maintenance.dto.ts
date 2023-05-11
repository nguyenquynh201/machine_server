import { NotificationType } from "src/commons/enums/notifications/notificationTypeEnum";
import { MaintenanceScheduleTarget } from "../interface/maintenance-schedule-target";

export class QueryMaintenance {
    search?: string;
    status?: string;
    assignee?: string | string[];
    fromDate?: Date;
    toDate?: Date;
    target?: MaintenanceScheduleTarget;
    type?: NotificationType | string[];
    idUser?: string;
    roles?: string;
}