export default interface AccountParams {
  id: string;
  email: string;
  isPrimary: boolean;
  name: string;
  userId: string;
  sub: string;
  provider: string;
  profileImage: string | null;
  createdAt?: Date;
}
