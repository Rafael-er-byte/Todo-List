import Handler from "../../../../shared/core/handler/Handler";
import Account from "../../../account/core/model/Account";
import User from "../../../user/core/model/User";
import type UserIdentityDto from "../dtos/UserIdentityDto";
import type AuthenticationDto from "../dtos/AuthenticationDto";
import ID from "../../../../shared/core/objects/ID";
import UserSettings from "../../../userSettings/core/model/UserSettings";
import type UserRepository from "../../../user/core/repository/UserRepository";
import type AccountRepository from "../../../account/core/repository/AccountRespository";
import type UserSetingsRepository from "../../../userSettings/core/repository/UserSettingsRepository";
import type { Transaction } from "../../../../shared/core/transaction/Transaction";
import type { AuthProvider } from "../../infrastructure/AuthProvider";

export default class AuthenticateUser <DATABASE> extends Handler <AuthenticationDto, UserIdentityDto>{

    constructor(
        private userRepo: UserRepository<DATABASE>,
        private accountRepo: AccountRepository,
        private userSettingsRepo: UserSetingsRepository,
        private transaction: Transaction<DATABASE>, 
        private auth: AuthProvider
    ){
        super();
    }

    async execute(data: AuthenticationDto): Promise<UserIdentityDto> {
        data.chronLog.info('Starting user authentication');

        const authenticatedUser = await this.metric.withMetric(async () => {
            return await this.auth.authenticate(data.code);
        }, 'Validate authentication code with provider', data.chronLog);

        return await this.transaction.withTransaction(async (tx) => {
            const exists = await this.metric.withMetric(async () => {
                return await this.userRepo.existsUserByAccountIdAndProvider(authenticatedUser.sub, authenticatedUser.provider);
            }, 'Check if an user already exists in database', data.chronLog);
            
            if(exists){
                return {
                    token: authenticatedUser.token,
                    created: false
                }
            }

            const userName = data.name ?? authenticatedUser.name;
            const urlProfileImage = data.urlProfileImage ?? authenticatedUser.profileImage ?? null;

            const user = User.fromPrimitives({
                id: ID.generateId().toString(),
                name: userName,
                ...(urlProfileImage !== null && {urlImage: urlProfileImage}),
                accounts: []
            });
            data.chronLog.info(`User created with id: ${user.getId()}`);

            const account = Account.create({
                email: authenticatedUser.email,
                isPrimary: true,
                name: authenticatedUser.name,
                userId: user.getId().toString(),
                sub: authenticatedUser.sub,
                provider: authenticatedUser.provider,
                profileImage: authenticatedUser.profileImage ?? null,
            });

            data.chronLog.info(`User account created with id: ${account.getId()}`);

            const userSettings = new UserSettings({
                id: ID.generateId().toString(), 
                userId: user.getId().toString(), 
                timezone: data.timezone
            });
            
            data.chronLog.info(`User settings created with id: ${userSettings.getId()}`);

            await this.metric.withMetric(async () => {
                await this.userRepo.createUser(user, tx);
            }, "User creation in database", data.chronLog);

            await this.metric.withMetric(async () => {
                await this.accountRepo.createAccount(account, tx);
            }, "Account saved in database", data.chronLog);

            await this.metric.withMetric(async () => {
                await this.userSettingsRepo.createUserSettings(userSettings, tx);
            }, "Save user settings in database", data.chronLog);
            
            return {
                token: authenticatedUser.token,
                created: true
            }
        });
    }
}
