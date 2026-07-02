import type None from "../../../../shared/core/objects/None";
import type Account from "../../../account/core/model/Account";
import type User from "../model/User";

export default interface UserRepository{
    createUserWithAccount(user: User, account: Account): Promise<void>
    existsUserByAccountId(accountId: string): Promise<User | None>
}
