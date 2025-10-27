import { AccountUser } from './account-user.interface';

export interface AllUsersResponse {
  users: AccountUser[];
  roles: string[];
}
