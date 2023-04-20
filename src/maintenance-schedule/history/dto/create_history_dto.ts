
export class CreateHistoryDto {
    maintenance_schedule: string;
    before: object;
    after?: object;
    change: object;
    updatedBy: string;
}
