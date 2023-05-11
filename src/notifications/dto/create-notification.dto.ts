/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsBoolean, IsMongoId, IsObject, IsOptional, IsString } from "class-validator";
import { NotificationType } from "src/commons/enums/notifications/notificationTypeEnum";
import { UserRole } from "src/users/interface/userRoles";

export class CreateNotificationDto {
    @IsString()
    title: string;

    @IsString()
    description?: string;

    @IsString()
    @IsOptional()
    type: NotificationType;

    @IsMongoId()
    author: string;

    @IsBoolean()
    isRead: boolean = false;

    @IsObject()
    object?: Record<string, string>;

    @IsMongoId()
    @IsOptional()
    owner?: string;

    @IsMongoId()
    @IsOptional()
    relateStaff?: string;

    @IsString()
    @IsOptional()
    role: UserRole;

    @IsBoolean()
    assign?: boolean = false;
}
