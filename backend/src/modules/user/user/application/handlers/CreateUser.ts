import type { ResultActionDTO } from "../../../../shared/core/handler/DTO";
import type Handler from "../../../../shared/core/handler/Handler";
import Account from "../../../account/core/model/Account";
import User from "../../core/model/User";
import type UserRepository from "../../core/repository/UserRepository";
import type CreateUserDto from "../dtos/CreateUserDto";

export default class CreateUser implements Handler <CreateUserDto, ResultActionDTO>{
    constructor(private repo: UserRepository){}

    async execute(data: CreateUserDto): Promise<ResultActionDTO> {
        data.chronLog.info('Starting user creation');
        const user = User.fromPrimitives({
                                            id: data.id,
                                            accounts: []
                                        });
        data.chronLog.info(`user created with id: ${user.getID()}`);

        const account = Account.create(data.account);

        data.chronLog.info(`user account created with id: ${account.getID()}`);

        const start = performance.now();

        await this.repo.createWithAccount(user, account);

        const duration = performance.now() - start;
        data.chronLog.metric('Save user and account data in database', duration);
                                        
        return {
            success: true
        }
    }
}
