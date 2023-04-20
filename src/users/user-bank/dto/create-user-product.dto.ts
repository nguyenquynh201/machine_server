import { IsArray, IsMongoId, IsOptional, IsString, IsNumberString } from "class-validator";

export class CreateUserProductDto {
    @IsMongoId()
    userId: string;

    @IsMongoId()
    productId: string;
}
