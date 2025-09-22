import { AccountUser } from './account-user.interface';

export interface GetUserResponse {
  user: AccountUser;
  status: number;
}
