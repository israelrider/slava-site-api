import { Role } from '@/iam/enums/roles.enum'

export interface AccountUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly role: Role;
  readonly password: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
