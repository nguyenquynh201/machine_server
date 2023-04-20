import { ApiProperty } from "@nestjs/swagger";
import { TypeImg } from "../enums/typeimgs";

export class FileUploadDto {
  @ApiProperty({ enum: TypeImg, required: true })
  typeImg: TypeImg
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
