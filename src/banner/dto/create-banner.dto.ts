import { IsOptional, IsString, IsMongoId, IsEnum, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { BannerType } from "../interface/banner-type";
import { Status } from "src/commons/enums/status.enum";

export class CreateBannerDto {

    @IsString()
    @IsOptional()
    link: string;

    /**
     * status
     * @example "[active, inactive]"
     */
    @IsEnum(Status)
    @IsOptional()
    status: Status;

    /**
     * status
     * @example "[home, partner]"
     */
    @IsEnum(BannerType)
    bannerType: BannerType;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => BannerLanguage)
    bannerLanguage: BannerLanguage[];
}

class BannerLanguage {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    codeLanguage: string;
}