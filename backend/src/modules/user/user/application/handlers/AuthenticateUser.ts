import type Handler from "../../../../shared/core/handler/Handler";
import Account from "../../../account/core/model/Account";
import type { AuthProvider } from "../../core/infrastructure/auth/AuthProvider";
import User from "../../core/model/User";
import type UserRepository from "../../core/repository/UserRepository";
import type UserIdentityDto from "../dtos/UserIdentityDto";
import type AutenticationDto from "../dtos/AutenticationDto";
import ID from "../../../../shared/core/objects/ID";

export default class AuthenticateUser implements Handler <AutenticationDto, UserIdentityDto>{
    constructor(private repo: UserRepository, private auth: AuthProvider){}

    async execute(data: AutenticationDto): Promise<UserIdentityDto> {
        data.chronLog.info('Starting user authentication');

        let start = performance.now();
        const authenticatedUser = await this.auth.authenticate(data.code);
        let duration = performance.now() - start;
        data.chronLog.metric('Auth provider call', duration);

        start = performance.now();
        const exits = await this.repo.existsUserByAccountId(authenticatedUser.accountId);
        duration = performance.now() - start;
        data.chronLog.metric('Check if an user exists in database', duration);

        if(exits){
            return {
                token: authenticatedUser.token
            }
        }

        const user = User.fromPrimitives({
                                            id: ID.generateId().toString(),
                                            accounts: []
                                        });
        data.chronLog.info(`user created with id: ${user.getID()}`);

        const account = Account.create({
                                    id: authenticatedUser.accountId,
                                    email: authenticatedUser.email,
                                    isPrimary: true,
                                    name: authenticatedUser.name,
                                    userId: user.getID().toString(),
                                    provider: authenticatedUser.provider,
                                    profileImage: authenticatedUser.profileImage !== undefined? authenticatedUser.profileImage: null,
                                });

        data.chronLog.info(`user account created with id: ${account.getID()}`);

        start = performance.now();
        await this.repo.createUserWithAccount(user, account);
        duration = performance.now() - start;
        data.chronLog.metric('Save user and account data in database', duration);
                                        
        return {
            token: authenticatedUser.token
        }
    }
}
