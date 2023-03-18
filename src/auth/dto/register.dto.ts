import { IsEmail, IsOptional, IsMobilePhone, IsString, IsEnum } from "class-validator";

export class RegisterUserDto {
    @IsString()
    fullName: string;

    @IsString()
    @IsMobilePhone('vi-VN')
    phone: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    address: string;

}