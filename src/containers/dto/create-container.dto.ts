import { IsOptional, IsString } from "class-validator";

export class CreateContainerDto {
    @IsString()
    containerCode: string;

    @IsString()
    containerNumber: string;

    @IsString()
    @IsOptional()
    note?: string;

}
