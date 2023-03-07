import { UserRole } from "src/users/interface/userRoles";

export interface JwtPayload {
  id: string,
  user: string,
  role: UserRole,
  iss: string
}