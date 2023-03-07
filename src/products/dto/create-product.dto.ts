import { IsNumber, IsString, IsBoolean, IsOptional, IsArray, IsMongoId, Matches } from "class-validator";
export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    @Matches(/^[^\s].*[^\s]$/, { message: 'Code must not have whitespaces at beginning or end' })
    code: string;

    @IsString()
    category: string;

    @IsString()
    type: string;

    @IsNumber()
    price: number;

     /**
     * Check done of order
     * @example true
     */
    @IsBoolean()
    @IsOptional()
    show: boolean;

     /**
     * Array of containers id
     * @example ["6118e9fcb952b9001ce3a9ea"]
     */
      @IsArray()
      @IsMongoId({ each: true })
      containers: string[];
}
