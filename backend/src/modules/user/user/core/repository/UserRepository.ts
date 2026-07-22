import type None from "../../../../shared/core/objects/None";
import type User from "../model/User";
import type { Transaction } from "../../../../shared/core/transaction/Transaction";
import type IdEntity from "../../../../shared/core/objects/IdEntity";

export default interface UserRepository<TX> {
    createUser(user: User, tx?: TX): Promise<void>
    existsUserByAccountIdAndProvider(accountId: string, provider: string, tx?: TX): Promise<User | None>
     getUserById(id: IdEntity, withAccounts?: boolean): Promise<User>
}
