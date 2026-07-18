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

export default class AuthenticateUser <TransactionObject> extends Handler <AuthenticationDto, UserIdentityDto>{

    constructor(
        private userRepo: UserRepository<TransactionObject>,
        private accountRepo: AccountRepository,
        private userSettingsRepo: UserSetingsRepository,
        private transaction: Transaction<TransactionObject>, 
        private auth: AuthProvider
    ){
        super();
    }

    async execute(TransactionObject: AuthenticationDto): Promise<UserIdentityDto> {
        TransactionObject.chronLog.info('Starting user authentication');

        const authenticatedUser = await this.metric.withMetric(async () => {
            return await this.auth.authenticate(TransactionObject.code);
        }, 'Validate authentication code with provider', TransactionObject.chronLog);

        return await this.transaction.withTransaction(async (tx: TransactionObject) => {
            const exists = await this.metric.withMetric(async () => {
                return await this.userRepo.existsUserByAccountIdAndProvider(authenticatedUser.sub, authenticatedUser.provider);
            }, 'Check if an user already exists in TransactionObjectbase', TransactionObject.chronLog);
            
            if(exists){
                return {
                    token: authenticatedUser.token,
                    created: false
                }
            }

            const userName = TransactionObject.name ?? authenticatedUser.name;
            const urlProfileImage = TransactionObject.urlProfileImage ?? authenticatedUser.profileImage ?? null;

            const user = User.fromPrimitives({
                id: ID.generateId().toString(),
                name: userName,
                ...(urlProfileImage !== null && {urlImage: urlProfileImage}),
                accounts: []
            });
            TransactionObject.chronLog.info(`User created with id: ${user.getId()}`);

            const account = Account.create({
                email: authenticatedUser.email,
                isPrimary: true,
                name: authenticatedUser.name,
                userId: user.getId().toString(),
                sub: authenticatedUser.sub,
                provider: authenticatedUser.provider,
                profileImage: authenticatedUser.profileImage ?? null,
            });

            TransactionObject.chronLog.info(`User account created with id: ${account.getId()}`);

            const userSettings = new UserSettings({
                id: ID.generateId().toString(), 
                userId: user.getId().toString(), 
                timezone: TransactionObject.timezone
            });
            
            TransactionObject.chronLog.info(`User settings created with id: ${userSettings.getId()}`);

            await this.metric.withMetric(async () => {
                await this.userRepo.createUser(user, tx);
            }, "User creation in TransactionObjectbase", TransactionObject.chronLog);

            await this.metric.withMetric(async () => {
                await this.accountRepo.createAccount(account, tx);
            }, "Account saved in TransactionObjectbase", TransactionObject.chronLog);

            await this.metric.withMetric(async () => {
                await this.userSettingsRepo.createUserSettings(userSettings, tx);
            }, "Save user settings in TransactionObjectbase", TransactionObject.chronLog);
            
            return {
                token: authenticatedUser.token,
                created: true
            }
        });
    }
}
