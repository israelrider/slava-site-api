export interface AccountUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly password: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
