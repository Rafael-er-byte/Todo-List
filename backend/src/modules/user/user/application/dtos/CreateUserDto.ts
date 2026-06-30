import type { CommandDto } from "../../../../shared/core/handler/DTO";

export default interface CreateUserDto extends CommandDto{
    id: string;
    account: {
        id: string;
        email: string;
        isPrimary: boolean;
        name: string;
        userId: string;
        provider: string;
        profileImage?: string;
        createdAt?: Date;
    }
}
