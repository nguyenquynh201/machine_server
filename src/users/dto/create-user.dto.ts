import {
    IsArray, IsDateString, IsEmail, IsEnum, IsMongoId, IsOptional, IsMobilePhone, IsString, MaxLength,
    MinLength, IsBoolean
} from "class-validator";
import { UserRole } from "../interface/userRoles";
import { Gender } from "../interface/gender";

export class CreateUserDto {

    @IsString()
    fullName: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsMobilePhone('vi-VN')
    phone: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    addressProvince?: string;

    @IsString()
    @IsOptional()
    addressDistrict?: string;

    /**
     * Default is `view`
     * @example [user, staff]
     */
    @IsEnum(UserRole)
    role: UserRole;

    /**
     * Default is `view`
     * @example [male, female , other]
     */
    @IsEnum(Gender)
    gender?: Gender;

    @IsBoolean()
    resetPassword?: boolean

}
