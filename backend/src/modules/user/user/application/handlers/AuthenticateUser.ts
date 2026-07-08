import type Handler from "../../../../shared/core/handler/Handler";
import Account from "../../../account/core/model/Account";
import type { AuthProvider } from "../../core/infrastructure/auth/AuthProvider";
import User from "../../core/model/User";
import type UserRepository from "../../core/repository/UserRepository";
import type UserIdentityDto from "../dtos/UserIdentityDto";
import type AuthenticationDto from "../dtos/AuthenticationDto";
import ID from "../../../../shared/core/objects/ID";
import UserSettings from "../../../userSettings/core/model/UserSettings";

export default class AuthenticateUser implements Handler <AuthenticationDto, UserIdentityDto>{
    constructor(private repo: UserRepository, private auth: AuthProvider){}

    async execute(data: AuthenticationDto): Promise<UserIdentityDto> {
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
                token: authenticatedUser.token,
                created: false
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

        const userSettings = new UserSettings({id: ID.generateId().toString(), userId: user.getID().toString(), timezone: data.timezone});

        data.chronLog.info(`user account created with id: ${account.getID()}`);

        start = performance.now();
        await this.repo.createUserWithAccountAndDefaultUserSettings(user, account, userSettings);
        duration = performance.now() - start;
        data.chronLog.metric('Save user and account data in database', duration);
                                        
        return {
            token: authenticatedUser.token,
            created: true
        }
    }
}
