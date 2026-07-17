export type identity = {
    token: string;
    email: string;
    name: string;
    provider: string;
    sub: string;
    profileImage?: string;
    createdAt?: Date;
}
