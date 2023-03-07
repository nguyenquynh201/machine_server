import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateProductCtgDto {
    @ApiProperty() @IsString()
    name: string;

    @ApiPropertyOptional() @IsString() @IsOptional()
    note: string;
}
