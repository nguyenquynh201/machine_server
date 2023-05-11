
export class CreateMaintenanceHistoryDto {
    maintenance: string;
    before: object;
    after?: object;
    change: object;
    updatedBy: string;
}
