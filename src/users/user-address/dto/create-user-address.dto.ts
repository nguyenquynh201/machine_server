import { bool } from "aws-sdk/clients/signer";
import { Transform } from "class-transformer";
import { IsArray, IsMobilePhone, IsEnum, IsMongoId, IsOptional, IsString, IsNumberString, IsBoolean } from "class-validator";
import { Gender } from "src/users/interface/gender";

export class CreateUserAddressDto {
    @IsMongoId()
    userId: string;

    @IsString()
    nameAddress: string;

    @IsEnum(Gender)
    gender: Gender;

    @IsMobilePhone('vi-VN')
    phone: string;

    @IsString()
    addressProvince: string;

    @IsString()
    addressDistrict: string;

    @IsString()
    addressUser: string;

    @IsBoolean()
    @Transform(({ obj, key }) => {
        const value = obj[key];
        if (typeof value === 'string') {
            return obj[key] === 'true';
        }

        return value;
    })
    fixed?: boolean = false
}
