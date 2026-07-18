export default interface UserParams {
  id: string;
  name: string;
  urlImage?: string;
  primaryAccount?: string;
  accounts: string[];
}
