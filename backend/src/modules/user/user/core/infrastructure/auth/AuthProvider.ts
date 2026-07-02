export type identity = {
    token: string;
    accountId: string;
    email: string;
    name: string;
    provider: string;
    profileImage?: string;
    createdAt?: Date;
}

export interface AuthProvider{
    authenticate(code:string): Promise<identity>;
}
