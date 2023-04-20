import { UserRole } from "src/users/interface/userRoles";

export interface JwtUser {
    userId: string,
    username: string,
    owner?: string,
    role: UserRole,
    fullName?: string,
}