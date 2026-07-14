import type None from "../../../../shared/core/objects/None";
import type { Transaction } from "../../../../shared/core/transaction/Transaction";
import type User from "../model/User";

export default interface UserRepository{
    createUser(user: User, tx?: Transaction): Promise<void>
    existsUserByAccountIdAndProvider(accountId: string, provider: string): Promise<User | None>
}
