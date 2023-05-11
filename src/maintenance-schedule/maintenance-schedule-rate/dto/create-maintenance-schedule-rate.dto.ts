import { IsMongoId, IsString, IsNotEmpty, IsNumber, Min, Max, MaxLength, MinLength } from "class-validator";

export class CreateMaintenanceSCheduleRateDto {
    @IsMongoId()
    userId: string;

    @IsMongoId()
    maintenanceId: string;

    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(5)
    rating: number;

    @IsString()
    @IsNotEmpty()
    comment?: string;
}
