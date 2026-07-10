import Handler from "../../../../shared/core/handler/Handler";
import Account from "../../../account/core/model/Account";
import type { AuthProvider } from "../../../user/core/infrastructure/auth/AuthProvider";
import User from "../../../user/core/model/User";
import type UserIdentityDto from "../dtos/UserIdentityDto";
import type AuthenticationDto from "../dtos/AuthenticationDto";
import ID from "../../../../shared/core/objects/ID";
import UserSettings from "../../../userSettings/core/model/UserSettings";
import type UserRepository from "../../../user/core/repository/UserRepository";
import type AccountRepository from "../../../account/core/repository/AccountRespository";
import type UserSetingsRepository from "../../../userSettings/core/repository/UserSettingsRepository";
import type { Transaction } from "../../../../shared/core/transaction/Transaction";

export default class AuthenticateUser extends Handler <AuthenticationDto, UserIdentityDto>{

    constructor(
        private userRepo: UserRepository,
        private accountRepo: AccountRepository,
        private userSettingsRepo: UserSetingsRepository,
        private transaction: Transaction, 
        private auth: AuthProvider
    ){
        super();
    }

    async execute(data: AuthenticationDto): Promise<UserIdentityDto> {
        data.chronLog.info('Starting user authentication');

        const authenticatedUser = await this.metric.withMetric(async () => {
            return await this.auth.authenticate(data.code);
        }, 'Validate authentication code with provider', data.chronLog);

        return await this.transaction.withTransaction(async (tx: Transaction) => {
                const exits = await this.metric.withMetric(async () => {
                    return await this.userRepo.existsUserByAccountId(authenticatedUser.accountId);
                }, 'Check if an user already exists in database', data.chronLog);
                
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
                data.chronLog.info(`User created with id: ${user.getID()}`);

                const account = Account.create({
                                            accountId: authenticatedUser.accountId,
                                            email: authenticatedUser.email,
                                            isPrimary: true,
                                            name: authenticatedUser.name,
                                            userId: user.getID().toString(),
                                            provider: authenticatedUser.provider,
                                            profileImage: authenticatedUser.profileImage !== undefined? authenticatedUser.profileImage: null,
                                        });

                data.chronLog.info(`User account created with id: ${account.getID()}`);

                const userSettings = new UserSettings({
                                            id: ID.generateId().toString(), 
                                            userId: user.getID().toString(), 
                                            timezone: data.timezone
                                        });
                                        
                data.chronLog.info(`User settings created with id: ${userSettings.getID()}`);

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
            }
        );
    }
}
