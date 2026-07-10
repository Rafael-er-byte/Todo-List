export default interface AccountParams {
  id: string;
  email: string;
  isPrimary: boolean;
  name: string;
  userId: string;
  provider: string;
  profileImage: string | null;
  createdAt?: Date;
}

export interface AccountCreateParams extends Omit<AccountParams, 'id' | 'createdAt'> {
  accountId: string;
}
