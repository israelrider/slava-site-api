import { Role } from '@/iam/enums/roles.enum'

export interface JWTPayload {
  id: number;
  email: string;
  name: string;
  role: Role;
}
