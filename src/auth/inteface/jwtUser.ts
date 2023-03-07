import { UserRole } from "src/users/interface/userRoles";

export interface JwtUser {
    userId: string,
    username: string,
    role: UserRole
}