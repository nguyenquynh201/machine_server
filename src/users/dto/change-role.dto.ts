import { IsEnum, IsMongoId, IsArray } from "class-validator";
import { UserRole } from "../interface/userRoles";

export class ChangeRoleDto {
    @IsMongoId()
    userId: string;

    /**
     * Default is `view`
     * @example [view, edit]
     */
    @IsEnum(UserRole)
    role: UserRole;
}
