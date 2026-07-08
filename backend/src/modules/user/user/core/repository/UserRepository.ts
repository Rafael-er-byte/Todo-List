import type None from "../../../../shared/core/objects/None";
import type Account from "../../../account/core/model/Account";
import type UserSettings from "../../../userSettings/core/model/UserSettings";
import type User from "../model/User";

export default interface UserRepository{
    createUserWithAccountAndDefaultUserSettings(user: User, account: Account, settings: UserSettings): Promise<void>
    existsUserByAccountId(accountId: string): Promise<User | None>
}
