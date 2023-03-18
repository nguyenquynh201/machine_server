import {
    IsArray, IsDateString, IsEmail, IsEnum, IsMongoId, IsOptional, IsMobilePhone, IsString, MaxLength,
    MinLength
} from "class-validator";
import { UserRole } from "../interface/userRoles";

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

    /**
     * Default is `view`
     * @example [user, staff]
     */
    @IsEnum(UserRole)
    role: UserRole;

}
