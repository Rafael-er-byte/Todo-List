import Account from "../../../account/core/model/Account";
import User from "../../core/model/User";
import ID from "../../../../shared/core/objects/ID";
export default class AuthenticateUser {
    constructor(repo, auth) {
        this.repo = repo;
        this.auth = auth;
    }
    async execute(data) {
        data.chronLog.info('Starting user authentication');
        let start = performance.now();
        const authenticatedUser = await this.auth.authenticate(data.code);
        let duration = performance.now() - start;
        data.chronLog.metric('Auth provider call', duration);
        start = performance.now();
        const exits = await this.repo.existsUserByAccountId(authenticatedUser.accountId);
        duration = performance.now() - start;
        data.chronLog.metric('Check if an user exists in database', duration);
        if (exits) {
            return {
                token: authenticatedUser.token
            };
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
            ...(authenticatedUser.profileImage !== undefined && { profileImage: authenticatedUser.profileImage }),
        });
        data.chronLog.info(`user account created with id: ${account.getID()}`);
        start = performance.now();
        await this.repo.createUserWithAccount(user, account);
        duration = performance.now() - start;
        data.chronLog.metric('Save user and account data in database', duration);
        return {
            token: authenticatedUser.token
        };
    }
}
//# sourceMappingURL=AuthenticateUser.js.map