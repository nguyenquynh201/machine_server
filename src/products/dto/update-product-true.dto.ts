import { IsArray, IsMongoId } from "class-validator";
export class UpdateProductTrueDto {
     /**
     * Array of containers id
     * @example ["6118e9fcb952b9001ce3a9ea"]
     */
      @IsArray()
      @IsMongoId({ each: true })
      listId: string[];
}
