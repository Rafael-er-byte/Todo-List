import type None from "../../../../shared/core/objects/None";
import type User from "../model/User";

export default interface UserRepository<TransactionObject>{
    createUser(user: User, tx: TransactionObject): Promise<void>
    existsUserByAccountIdAndProvider(accountId: string, provider: string): Promise<User | None>
}
