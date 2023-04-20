import { IsNumber, IsString, IsBoolean, IsOptional, IsArray, IsMongoId, Matches, IsDateString, Length, MaxLength } from "class-validator";
export class CreateProductDto {
    @IsString()
    nameMaintenance: string;

    @IsString()
    @Length(10)
    serialNumber: string;

    @IsString()
    manufacturer: string;

    @IsString()
    specifications: string; /// thông số kỹ thuật

    @IsDateString()
    @IsOptional()
    yearOfManufacturer: Date; /// năm sản xuất

}
