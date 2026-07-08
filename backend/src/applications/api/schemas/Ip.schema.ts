import z from 'zod';

export const IpSchema = z.object({
    ip: z.ipv4
});
