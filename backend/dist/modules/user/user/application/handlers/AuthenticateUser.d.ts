import type Handler from "../../../../shared/core/handler/Handler";
import type { AuthProvider } from "../../core/infrastructure/auth/AuthProvider";
import type UserRepository from "../../core/repository/UserRepository";
import type UserIdentityDto from "../dtos/UserIdentityDto";
import type AutenticationDto from "../dtos/AutenticationDto";
export default class AuthenticateUser implements Handler<AutenticationDto, UserIdentityDto> {
    private repo;
    private auth;
    constructor(repo: UserRepository, auth: AuthProvider);
    execute(data: AutenticationDto): Promise<UserIdentityDto>;
}
//# sourceMappingURL=AuthenticateUser.d.ts.map