import { Role } from '@/iam/enums/roles.enum'

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    rating: number;
  };
}
