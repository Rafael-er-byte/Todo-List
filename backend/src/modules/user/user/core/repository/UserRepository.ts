import type Account from "../../../account/core/model/Account";
import type User from "../model/User";

export default interface UserRepository{
    createWithAccount(user: User, account: Account): Promise<void>
}
