import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateErrorMachineDto {
    @IsString()
    @IsOptional()
    maintenanceContent: string;

    @IsNumber()
    @IsOptional()
    price: number;
}
