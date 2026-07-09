import {z} from 'zod';

export const AuthenticateUserSchema = z.object({
    body: z.object({
        code: z.string().min(1),
        timezone: z.string().min(1)
    })
});
