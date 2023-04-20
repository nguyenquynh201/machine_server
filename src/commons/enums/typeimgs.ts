import { ApiProperty } from "@nestjs/swagger";

export enum TypeImg {
    Image = 'imageMachine',
    MetaImage = 'metaImage',
}
export class FileUploadImageDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
    @ApiProperty({ type: 'string', required: false, description: 'custom filename' })
    name: string;
    @ApiProperty({ type: 'string', required: false, description: 'custom filename' })
    description: string;
}