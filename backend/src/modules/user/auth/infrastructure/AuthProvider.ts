import type { identity } from "../application/dtos/Identity";

export interface AuthProvider{
    //throws Unauthorized('Invalid authentication code')
    authenticate(code:string): Promise<identity>;
}
