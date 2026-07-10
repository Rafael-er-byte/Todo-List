import type None from "../../../../shared/core/objects/None";
import type Transaction from "../../../../shared/core/repository/Transacction";
import type User from "../model/User";

export default interface UserRepository{
    createUser(user: User, tx?: Transaction): Promise<void>
    existsUserByAccountId(accountId: string): Promise<User | None>
}
